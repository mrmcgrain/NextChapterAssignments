import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../apps/client/dist-verified/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon','.ttf':'font/ttf','.json':'application/json'};
http.createServer(async (request,response) => {
  const requestPath = new URL(request.url,'http://localhost').pathname;
  if (requestPath === '/health' || requestPath.startsWith('/api/v1/')) {
    const upstream = http.request({hostname:'127.0.0.1',port:3001,path:request.url,method:request.method,
      headers:{...request.headers,host:'127.0.0.1:3001'}}, result => {
      response.writeHead(result.statusCode ?? 502,result.headers);
      result.pipe(response);
    });
    upstream.setTimeout(15_000,()=>upstream.destroy(new Error('API timeout')));
    upstream.on('error',()=>{
      if (!response.headersSent) response.writeHead(503,{'Content-Type':'application/json'});
      response.end(JSON.stringify({error:'Could not reach the meeting service.'}));
    });
    request.pipe(upstream);
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let file = path.resolve(root, `.${pathname}`);
    if (file !== path.resolve(root) && !file.startsWith(root)) {response.writeHead(403).end();return;}
    try {if (!(await stat(file)).isFile()) file=path.join(root,'index.html');}
    catch {if(path.extname(pathname)){response.writeHead(404).end();return;}file=path.join(root,'index.html');}
    const body=await readFile(file);
    response.writeHead(200,{'Content-Type':types[path.extname(file)] ?? 'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch {response.writeHead(500).end('Preview unavailable');}
}).listen(8081,process.env.PREVIEW_HOST ?? '127.0.0.1',()=>console.log('Built web preview available on port 8081'));

