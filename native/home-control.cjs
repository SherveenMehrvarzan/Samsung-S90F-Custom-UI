// Owner-authorized, firmware-guarded Home control over a one-shot SDK callback.
// Credentials are not required. Device identity and baseline stay in local files.
const fs=require('node:fs'),path=require('node:path'),net=require('node:net'),http=require('node:http'),dgram=require('node:dgram'),crypto=require('node:crypto'),{spawnSync,spawn}=require('node:child_process');
const options={};for(let i=2;i<process.argv.length;i+=2)options[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
const mode=options.mode||'query';if(!['query','verify','restore','apply','startup'].includes(mode))throw Error('Invalid mode');
const config=JSON.parse(fs.readFileSync(options.device,'utf8')),baselineFile=path.resolve(options.baseline),controllerFile=path.resolve(options.controller),sdb=path.resolve(options.sdb);
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
if(net.isIP(config.tvAddress)!==4)throw Error('Expected a local TV IPv4 address');
if(hash(fs.readFileSync(baselineFile))!==config.baselineSha256||hash(fs.readFileSync(controllerFile))!==config.controllerSha256)throw Error('Baseline or controller integrity check failed');
const baseline=JSON.parse(fs.readFileSync(baselineFile,'utf8')),tv=config.tvAddress,serial=tv+':26101';
function sdk(args){const r=spawnSync(sdb,args,{encoding:'utf8',windowsHide:true,timeout:20000});if(r.error)throw r.error;return(r.stdout||'')+(r.stderr||'');}
function getDevice(){return new Promise((resolve,reject)=>{const req=http.get('http://'+tv+':8001/api/v2/',res=>{let data='';res.on('data',d=>{data+=d;if(data.length>100000)req.destroy(Error('Oversized device response'));});res.on('end',()=>{try{resolve(JSON.parse(data).device);}catch(e){reject(e);}});});req.setTimeout(6000,()=>req.destroy(Error('TV identity request timed out')));req.on('error',reject);});}
function localAddress(){return new Promise((resolve,reject)=>{const socket=dgram.createSocket('udp4');socket.on('error',reject);socket.connect(9,tv,()=>{const address=socket.address().address;socket.close();resolve(address);});});}
function encodedCommand(script){const arg='0 appinstall tpk new2.tpk`printf${IFS}%s${IFS}'+Buffer.from(script).toString('base64')+'|base64${IFS}-d|bash`.tpk';if(Buffer.byteLength(arg)>510)throw Error('SDK command exceeds safe field bound');return arg;}
function capture(command,pc){return new Promise((resolve,reject)=>{
 const nonce=crypto.randomBytes(6).toString('hex'),gate='qh-'+crypto.randomBytes(4).toString('hex');let child,complete=false;
 const server=net.createServer(socket=>{
  if(socket.remoteAddress!==tv){socket.destroy();return;}
  let data='';socket.setTimeout(15000,()=>socket.destroy());socket.on('data',chunk=>{data+=chunk;if(data.length>100000)socket.destroy();});
  socket.on('end',()=>{if(!data.startsWith(nonce+'\n'))return finish(Error('Callback identity mismatch'));finish(null,data.slice(nonce.length+1));});socket.on('error',finish);
 });
 function finish(error,data){if(complete)return;complete=true;clearTimeout(timer);server.close();if(child&&!child.killed)child.kill();error?reject(error):resolve(data);}
 const timer=setTimeout(()=>finish(Error('No verified TV response; native state is unknown until queried')),30000);
 server.on('error',finish);server.listen(0,pc,()=>{
  const port=server.address().port,script='mkdir /tmp/'+gate+' 2>/dev/null&&{ { echo '+nonce+';'+command+';echo QH_EXIT:$?; } >/dev/tcp/'+pc+'/'+port+' 2>&1;rmdir /tmp/'+gate+';}';
  try{child=spawn(sdb,['-s',serial,'shell',encodedCommand(script)],{windowsHide:true});child.on('error',finish);child.stdout.resume();child.stderr.resume();}catch(e){finish(e);}
 });
});}
(async()=>{
 const device=await getDevice(),pc=await localAddress();
 if(device.modelName!==config.modelName||hash(device.duid)!==config.duidSha256||String(device.developerMode)!=='1'||device.developerIP!==pc)throw Error('TV identity or Developer Mode host check failed');
 sdk(['connect',serial]);
 const id=crypto.randomBytes(4).toString('hex'),base='/home/owner/share/tmp/sdk_tools/',remoteController=base+'qhc'+id+'.dll',remoteBaseline=base+'qhb'+id+'.json';
 for(const [local,remote] of [[controllerFile,remoteController],[baselineFile,remoteBaseline]]){const result=sdk(['-s',serial,'push',local,remote]);if(!result.includes('1 file(s) pushed'))throw Error('Staging failed: '+result);}
 let output;
 try{
  const command='/usr/bin/dotnet '+remoteController+' '+mode+(mode==='query'?'':' '+remoteBaseline);
  output=await capture(command,pc);
 }finally{
  // Remove only the two exact temporary files staged by this invocation.
  try{sdk(['-s',serial,'shell',encodedCommand('rm -f '+remoteController+' '+remoteBaseline)]);}catch(e){console.error('Temporary-file cleanup could not be verified.');}
 }
 const prefix={query:'QH_QUERY=',verify:'QH_VERIFIED=',restore:'QH_RESTORED=',apply:'QH_APPLIED=',startup:'QH_STARTUP='}[mode];
 const line=output.split(/\r?\n/).find(l=>l.startsWith(prefix));
 if(!line||!output.includes('QH_EXIT:0')){if(output.includes('QH_URGENT_RESTORE_FAILED='))throw Error('Native rollback failed; preserve the launcher and inspect the saved recovery log');throw Error(output.split(/\r?\n/).filter(l=>/^QH_/.test(l)).join('\n')||'No validated controller result');}
 const result=JSON.parse(line.slice(prefix.length));
 if(!result.Firmware.includes(config.firmware)||result.Uid!==901||result.Bits!==32)throw Error('Native result compatibility check failed');
 if(options.output)fs.writeFileSync(options.output,JSON.stringify(result,null,2));
 console.log(mode.toUpperCase()+': Home='+result.Home+'; home_appid='+result.Strings['db/appfw/home_appid']+'; startup='+result.Strings['db/appfw/startup_appid']+'; autostart='+result.Autostart);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
