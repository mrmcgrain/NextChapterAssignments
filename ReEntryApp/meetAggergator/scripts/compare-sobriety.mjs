import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {Pool} from 'pg';
import assert from 'node:assert/strict';

// Read-only comparison: allowlisted public meeting fields, no database writes or key copies.
const norm=v=>String(v??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const program=v=>({'recovery dharma':'RD','smart recovery':'SMART','wellbriety':'WB'}[norm(v)]??String(v).toUpperCase());
const name=v=>norm(v).replace(/^(aa|na|cma|rd|smart recovery|recovery dharma) /,'');
const street=v=>norm(v).replace(/\bstreet\b/g,'st').replace(/\bavenue\b/g,'ave').replace(/\broad\b/g,'rd').replace(/\bdrive\b/g,'dr').replace(/\bboulevard\b/g,'blvd').replace(/\bnorth\b/g,'n').replace(/\bsouth\b/g,'s').replace(/\beast\b/g,'e').replace(/\bwest\b/g,'w').split(/\b(?:az|arizona|usa|united states)\b/)[0].trim();
function distance(a,b){
  if([a.latitude,a.longitude,b.latitude,b.longitude].some(v=>v==null||!Number.isFinite(Number(v))))return Infinity;
  const rad=v=>Number(v)*Math.PI/180;
  const h=Math.sin(rad(b.latitude-a.latitude)/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(rad(b.longitude-a.longitude)/2)**2;
  return 3958.8*2*Math.asin(Math.min(1,Math.sqrt(h)));
}
const slot=m=>`${m.program}|${m.day}|${m.time}`;
function score(a,b){
  if(slot(a)!==slot(b)||!a.time||!a.name||!b.name)return 0;
  const x=street(a.address),y=street(b.address);
  const address=/^\d/.test(x)&&/^\d/.test(y)&&(x===y||x.startsWith(y+' ')||y.startsWith(x+' '));
  const place=address||distance(a,b)<0.2;
  const sameName=name(a.name)===name(b.name);
  return sameName&&place?3:sameName||place?1:0;
}
const fixture={program:'AA',day:1,time:'19:00',name:'Early Birds',address:'123 North Main Street'};
assert.equal(score(fixture,{...fixture,name:'AA Early Birds',address:'123 N Main St, Phoenix, AZ'}),3);
assert.equal(score(fixture,{...fixture,day:2}),0);
assert.equal(score({...fixture,address:null},{...fixture,address:null}),1);
if(process.argv.includes('--self-check')){console.log('Matching checks passed.');process.exit(0);}
process.loadEnvFile('.env');
const note=process.env.SOBRIETY_KEY_FILE??'F:\\Obsidian\\SecondBrain\\NextChapter\\Meeting Agg\\API.md';
const key=process.env.SOBRIETY_API_KEY??(await readFile(note,'utf8')).match(/jb4l_[a-fA-F0-9]+/)?.[0];
if(!key)throw new Error('Key unavailable. Set SOBRIETY_API_KEY or SOBRIETY_KEY_FILE.');
const endpoint='https://jb4l-meeting-api.erich-owens.workers.dev/v1/meetings';
const publicAccess=process.argv.includes('--public');
const startedAt=new Date().toISOString();
const pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000});
let ours;
try{ours=(await pool.query(`SELECT m.id,s.slug AS source,m.source_meeting_id AS "sourceMeetingId",m.name,m.fellowship AS program,
 m.day_of_week AS day,to_char(m.start_time,'HH24:MI') AS time,m.timezone,m.format,m.address,m.city,m.state,
 ST_Y(m.geo_point::geometry) AS latitude,ST_X(m.geo_point::geometry) AS longitude,m.last_synced_at AS "lastSyncedAt"
 FROM meetings m JOIN sources s ON s.id=m.source_id WHERE m.active AND s.enabled AND s.approved ORDER BY m.id`)).rows
 .filter(m=>norm(m.state)==='az').map(m=>({...m,program:program(m.program)}));}finally{await pool.end();}
const requests=[],remote=new Map();
const programs=['AA','NA','CA','CMA','MA','OA','RD','SMART','WB','AlAnon','LifeRing'];
let rateLimited=false;
async function query(day,code,lat=34.3,lng=-111.7,radius=350){
  if(rateLimited)return null;
  const url=new URL(endpoint);
  for(const [k,v]of Object.entries({lat,lng,radius,limit:500,day,...(code?{program:code}:{})}))url.searchParams.set(k,String(v));
  const response=await fetch(url,{headers:publicAccess?{}:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(40000),redirect:'error'});
  if(response.status===401)throw new Error('Bearer API access denied. Verify key approval before retrying; --public explicitly uses the lower public quota.');
  if(!response.ok){requests.push({day,program:code??null,lat,lng,radius,status:response.status});console.log(`Day ${day} ${code??'all'}: HTTP ${response.status}`);if(response.status===429)rateLimited=true;return null;}
  const payload=await response.json(),rows=payload.meetings;
  if(!Array.isArray(rows))throw new Error('Response lacks meetings array.');
  if(rows.some(m=>Number(m.day_of_week)!==day||(code&&program(m.program)!==program(code))))throw new Error('API ignored day or program filter.');
  for(const m of rows)remote.set(String(m.id),{id:String(m.id),name:m.name??'',program:program(m.program),day:Number(m.day_of_week),time:String(m.start_time??'').slice(0,5),timezone:m.timezone??null,format:m.format??null,address:m.address??null,city:m.city??null,state:m.state??null,latitude:m.latitude==null?null:Number(m.latitude),longitude:m.longitude==null?null:Number(m.longitude),source:m.source??null,sourceUrlPresent:Boolean(m.source_url),updatedAt:m.last_seen_at??m.fetched_at??null});
  requests.push({day,program:code??null,lat,lng,radius,status:200,count:rows.length,capped:rows.length>=500});
  await mkdir('output/sobriety-comparison',{recursive:true});
  await writeFile('output/sobriety-comparison/checkpoint.json',JSON.stringify({startedAt,accessMode:publicAccess?'public':'bearer',requests,allFetched:[...remote.values()]},null,2)+'\n');
  console.log(`Day ${day} ${code??'all'}: ${rows.length}${rows.length>=500?' (cap reached)':''}`);
  return rows;
}
for(let day=0;day<7;day++){
  const all=await query(day);
  if(!all||all.length>=500)for(const code of [...new Set([...programs,...(all??[]).map(m=>m.program)])]){
    const rows=await query(day,code);
    if(rows?.length>=500)for(const [lat,lng]of [[32.4,-113.1],[32.4,-110],[35.4,-113.1],[35.4,-110]])await query(day,code,lat,lng,175);
  }
}
const theirs=[...remote.values()].filter(m=>['az','arizona'].includes(norm(m.state)));
const bySlot=new Map();
for(const m of theirs){const k=slot(m);if(!bySlot.has(k))bySlot.set(k,[]);bySlot.get(k).push(m);}
const edges=[];
for(const a of ours)for(const b of bySlot.get(slot(a))??[])if(score(a,b)===3)edges.push({a,b});
const usedA=new Set(),usedB=new Set(),overlap=[];
for(const {a,b}of edges.sort((x,y)=>distance(x.a,x.b)-distance(y.a,y.b))){if(usedA.has(a.id)||usedB.has(b.id))continue;usedA.add(a.id);usedB.add(b.id);overlap.push({ours:a.id,theirs:b.id,name:a.name,program:a.program,day:a.day,time:a.time,formatDiff:a.format?.replace('_','-')!==b.format,cityDiff:norm(a.city)!==norm(b.city)});}
const onlyOurs=ours.filter(m=>!usedA.has(m.id)),onlyTheirs=theirs.filter(m=>!usedB.has(m.id)),review=[];
for(const a of onlyOurs)for(const b of bySlot.get(slot(a))??[])if(!usedB.has(b.id)&&score(a,b)===1)review.push({ours:a.id,theirs:b.id,nameOurs:a.name,nameTheirs:b.name,program:a.program,day:a.day,time:a.time,cityOurs:a.city,cityTheirs:b.city});
const counts=items=>Object.fromEntries([...new Set(items.map(m=>m.program))].sort().map(p=>[p,items.filter(m=>m.program===p).length]));
const summary={ours:ours.length,theirs:theirs.length,overlap:overlap.length,unmatchedOurs:onlyOurs.length,unmatchedTheirs:onlyTheirs.length,reviewPairs:review.length,requestCount:requests.length,unknownStateFetched:[...remote.values()].filter(m=>!m.state).length,coverageIssues:requests.filter(r=>r.status!==200||(r.capped&&r.radius===175))};
const report={startedAt,finishedAt:new Date().toISOString(),endpoint,method:'Arizona-labelled listings within 350 miles of 34.3,-111.7, partitioned by day/program with regional fallback. Overlap requires program/day/time/name plus matching street or coordinates within 0.2 miles. One-to-one listing matching.',limitations:['Geographic API may exclude online meetings without coordinates.','Published start times compared literally; remote timezone missing is not corrected or inferred.','IDs count schedule listings, not independently verified meetings.','Unmatched records need review for renamed groups, schedule changes, location omissions or duplicates.','Unknown programs beyond a saturated broad response may remain undiscovered.','No imports, database mutations or upstream source refresh.'],summary,byProgram:{ours:counts(ours),theirs:counts(theirs),overlap:counts(overlap)},quality:{missingTimezone:theirs.filter(m=>!m.timezone).length,missingCity:theirs.filter(m=>!m.city).length,missingAddress:theirs.filter(m=>!m.address).length,missingSource:theirs.filter(m=>!m.source).length},requests,ours,theirs,overlap,unmatchedOurs:onlyOurs,unmatchedTheirs:onlyTheirs,reviewPairs:review};
report.accessMode=publicAccess?'public':'bearer';
report.allFetched=[...remote.values()];
await mkdir('output/sobriety-comparison',{recursive:true});
await writeFile('output/sobriety-comparison/report.json',JSON.stringify(report,null,2)+'\n');
let md=`# Sobriety.tools comparison\n\nCaptured ${report.finishedAt}. Read-only; no imports.\n\n${report.method}\n\n| Program | Ours | Theirs | Confident overlap |\n|---|---:|---:|---:|\n`;
for(const p of [...new Set([...Object.keys(report.byProgram.ours),...Object.keys(report.byProgram.theirs)])].sort())md+=`| ${p} | ${report.byProgram.ours[p]??0} | ${report.byProgram.theirs[p]??0} | ${report.byProgram.overlap[p]??0} |\n`;
md+=`\nSummary: ${JSON.stringify(summary)}\n\nRemote field quality: ${JSON.stringify(report.quality)}\n\n## Limits\n\n${report.limitations.map(x=>'- '+x).join('\n')}\n\nFull allowlisted evidence: output/sobriety-comparison/report.json. No keys, contact fields or conference URLs persisted.\n`;
await writeFile('docs/sobriety-comparison.md',md);
console.log(JSON.stringify({summary,byProgram:report.byProgram,quality:report.quality},null,2));
