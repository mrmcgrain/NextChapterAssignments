import type { Meeting } from '../lib/api';

export function mapHtml(meetings: Meeting[]) {
  const data = JSON.stringify(meetings.map(({id,name,fellowship,dayOfWeek,startTime,venueName,address,latitude,longitude}) => ({id,name,fellowship,dayOfWeek,startTime,venueName,address,latitude,longitude}))).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{height:100%;margin:0;font:14px system-ui}#status{position:absolute;top:8px;left:55px;z-index:1000;background:white;padding:8px;border-radius:6px}.leaflet-popup-content{max-height:240px;overflow:auto}button{padding:8px;margin-bottom:8px;cursor:pointer}</style></head><body><div id="map" role="region" aria-label="Matching meeting locations"></div><div id="status">Loading map…</div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onerror="document.getElementById('status').textContent='Map unavailable. Use the meeting list below.'"></script><script>
if(window.L){
const map=L.map('map',{scrollWheelZoom:false}).setView([34.2,-111.8],6);
const status=document.getElementById('status');status.style.display='none';
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror',()=>{status.style.display='block';status.textContent='Map tiles unavailable. Meeting dots and the list are still available.'}).addTo(map);
const groups=new Map();const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
for(const m of ${data}){const key=m.latitude+','+m.longitude;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}
const points=[];
for(const group of groups.values()){
const first=group[0],point=[first.latitude,first.longitude];points.push(point);
const popup=document.createElement('div');
for(const m of group){const title=document.createElement('strong');title.textContent=m.name;popup.append(title);const info=document.createElement('p');info.textContent=m.fellowship+' · '+days[m.dayOfWeek]+' · '+m.startTime+' · '+(m.venueName||m.address||'Meeting location');popup.append(info);const button=document.createElement('button');button.textContent='View meeting details';button.onclick=()=>{const message=JSON.stringify({meetingId:m.id});if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(message);else window.parent.postMessage(message,'*');};popup.append(button);}
L.circleMarker(point,{radius:group.length>1?10:7,color:'#ffffff',weight:2,fillColor:'#087f75',fillOpacity:0.95}).addTo(map).bindPopup(popup).bindTooltip(group.length+' meeting'+(group.length===1?'':'s')+' here');
}
if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[30,30],maxZoom:14});
}
</script></body></html>`;
}
