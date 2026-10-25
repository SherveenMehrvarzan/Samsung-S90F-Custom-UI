(function(){
 'use strict';
 var $=function(id){return document.getElementById(id);},onTV=!!(window.tizen&&tizen.application);
 var state={view:'home',apps:[],sources:[],current:null,ready:false,inputsReady:false,inputError:false,busy:false};
 var toastTimer,generation=0,focusMemory={};
 var favorites=[{id:'org.tizen.netflix-app',name:'Netflix',brand:'netflix'},{id:'5b8c3eb16b.BeamCTVDev',name:'HBO Max',brand:'hbo'},{id:'org.tizen.primevideo',name:'Prime Video',brand:'prime'},{id:'rJeHak5zRg.Spotify',name:'Spotify',brand:'spotify'},{id:'Jz7aUrV2Q4.Twitch',name:'Twitch',brand:'twitch'}];
 var destinations={store:'com.samsung.tv.store',settings:'org.tizen.menu','samsung-home':'com.samsung.tv.csfs','source-menu':'org.tizen.SMSourceAPP'};
 // On this firmware "show" is also true for internal service applications.
 // Store web apps use Tizen's 10-character package ID; include observed native
 // consumer apps separately rather than exposing internal platform components.
 var nativeConsumer=['org.tizen.netflix-app','org.tizen.primevideo','com.samsung.tv.store','com.samsung.tv.aria-video','com.samsung.tv.cobalt-yt','com.samsung.tv.cobalt-ytkids','com.samsung.tv.cobalt-yttv','org.tizen.browser','com.samsung.tv.tvplus','com.samsung.tv.samsung-health','com.samsung.tv.SmartThingsApp','com.microsoft.copilot'];
 var icons={store:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="20" width="40" height="34" rx="7"/><path d="M23 22v-5a9 9 0 0 1 18 0v5M23 35h18m-9-9v18"/></svg>',input:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="8" width="38" height="27" rx="4"/><path d="M17 42h14m-7-7v7M17 20h14m-5-5 5 5-5 5"/></svg>',tv:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="10" width="38" height="26" rx="4"/><path d="M17 42h14m-7-6v6"/></svg>'};
 function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){$('toast').hidden=true;},5500);}
 function focus(el){if(el&&!el.hidden){el.focus();el.scrollIntoView({block:'nearest',inline:'nearest'});}}
 function button(name,action,cls){var el=document.createElement('button');el.className=cls||'';el.setAttribute('data-focus','');el.setAttribute('aria-label',name);el.addEventListener('click',action);return el;}
 function appTile(app){
  var known=favorites.filter(function(f){return f.id===app.id;})[0],brand=app.brand||(known&&known.brand)||'';
  var el=button(app.name,function(){launch(app.id,app.name);},'app');el.dataset.appId=app.id;
  var tile=document.createElement('span');tile.className='tile '+brand;var vectorKey=brand;if(/^Hulu$/i.test(app.name))vectorKey='hulu';if(/^Apple TV$/i.test(app.name))vectorKey='appletv';if(/^YouTube$/i.test(app.name))vectorKey='youtube';if(/^YouTube TV$/i.test(app.name))vectorKey='youtubetv';if(/^YoutubeKids$/i.test(app.name))vectorKey='youtubekids';if(/^Spotify/i.test(app.name))vectorKey='spotify';if(/^SmartThings$/i.test(app.name))vectorKey='smartthings';if(/^Tubi/i.test(app.name))vectorKey='tubi';if(/^Perplexity/i.test(app.name))vectorKey='perplexity';
  if(['netflix','hbo','prime','hulu','twitch','appletv','youtube','youtubetv','youtubekids','spotify','smartthings','tubi','perplexity'].indexOf(vectorKey)!==-1){var mark=document.createElement('img');mark.className='brand-logo';mark.alt='';mark.src='logos/'+vectorKey+(vectorKey==='prime'?'.jpg':'.svg');tile.classList.add('art-'+vectorKey);mark.onerror=function(){mark.remove();tile.textContent=app.name;};tile.appendChild(mark);}
  else if(brand==='netflix')tile.textContent='N';
  else if(brand==='hbo'){var hbo=document.createElement('small');hbo.textContent='HBO';tile.appendChild(hbo);tile.appendChild(document.createTextNode('max'));}
  else if(brand==='prime'){tile.textContent='prime video';var smile=document.createElement('span');smile.className='smile';tile.appendChild(smile);}
  else if(brand==='hulu'||brand==='twitch')tile.textContent=brand;
  else if(brand==='store')tile.innerHTML=icons.store;
  else{var letter=document.createElement('span');letter.className='generic-letter';letter.textContent=app.name.slice(0,1).toUpperCase();tile.appendChild(letter);
   if(onTV&&app.iconPath&&/^(file:\/\/|\/)/.test(app.iconPath)){var img=document.createElement('img');img.alt='';img.onload=function(){tile.classList.add('has-icon');matchBackground(tile,img);};img.onerror=function(){img.remove();};img.src=app.iconPath[0]==='/'?'file://'+app.iconPath:app.iconPath;tile.appendChild(img);}
  }
  var art=document.createElement('span');art.className='tile-art';while(tile.firstChild)art.appendChild(tile.firstChild);tile.appendChild(art);var label=document.createElement('span');label.className='app-label';label.textContent=app.name;el.appendChild(tile);el.appendChild(label);return el;
 }
 function matchBackground(tile,img){try{var c=document.createElement('canvas');c.width=c.height=16;var ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,16,16);var data=ctx.getImageData(0,0,16,16).data,buckets={};for(var i=0;i<data.length;i+=4){if(data[i+3]<220)continue;var x=(i/4)%16,y=Math.floor(i/64),edge=x<3||x>12||y<3||y>12,weight=edge?4:1,key=(data[i]>>4)+','+(data[i+1]>>4)+','+(data[i+2]>>4),b=buckets[key]||(buckets[key]={count:0,r:0,g:0,b:0});b.count+=weight;b.r+=data[i]*weight;b.g+=data[i+1]*weight;b.b+=data[i+2]*weight;}var best=Object.keys(buckets).map(function(k){return buckets[k];}).sort(function(a,b){return b.count-a.count;})[0];if(best)tile.style.setProperty('--tile-background','rgb('+Math.round(best.r/best.count)+','+Math.round(best.g/best.count)+','+Math.round(best.b/best.count)+')');}catch(e){}}
 function renderApps(container,list){var active=document.activeElement,saved=container.contains(active)&&active.dataset.appId;container.replaceChildren();list.forEach(function(app){var tile=appTile(app);container.appendChild(tile);if(saved===app.id)focus(tile);});}
 function library(){return state.apps.filter(function(a){
  if(!a.name||a.id==='QuietHome1.Launcher'||/-dummy|_companionapp/.test(a.id)||a.id==='org.volt.apps'||a.id==='2025ePop01.SmartTV'||a.id==='yL49PNFmjW.PromotionApp')return false;
  if(/^(App|Setting|ui-application|service-application)$/i.test(a.name))return false;
  if(onTV&&!/^[A-Za-z0-9]{10}\./.test(a.id)&&nativeConsumer.indexOf(a.id)===-1)return false;
  return a.show===true||favorites.some(function(f){return f.id===a.id;})||a.id===destinations.store;
 }).map(function(a){return a.id===destinations.store?{id:a.id,name:'Samsung Apps',brand:'store'}:a;}).reduce(function(list,a){var key=a.name.toLowerCase().replace(/[^a-z0-9]/g,''),index=list.findIndex(function(b){return b.name.toLowerCase().replace(/[^a-z0-9]/g,'')===key;});if(index===-1)list.push(a);else if(/^[A-Za-z0-9]{10}\./.test(a.id))list[index]=a;return list;},[]).sort(function(a,b){return a.name.localeCompare(b.name);});}
 function renderLibrary(){var list=library();renderApps($('library'),list);$('app-count').textContent=state.ready?list.length+' installed apps':'Loading your apps…';renderSearch();}
 function renderSearch(){var query=$('search').value.trim().toLowerCase(),list=query?library().filter(function(a){return a.name.toLowerCase().indexOf(query)!==-1;}):[];renderApps($('search-results'),list);$('clear-search').hidden=!query;
  $('search-count').textContent=!query?'Start typing to find an app.':list.length?list.length+' installed '+(list.length===1?'app':'apps')+' found':'No installed apps match “'+$('search').value.trim()+'”. Try Samsung Apps below.';
 }
 function inputName(s){return s.type==='TV'?'Live TV':s.type.replace(/_/g,' ')+(s.number?' '+s.number:'');}
 function same(a,b){return a&&b&&a.type===b.type&&a.number===b.number;}
 function inputCard(source){var current=same(source,state.current),el=button(inputName(source),function(){switchInput(source);},'input-card'+(current?' current':''));el.dataset.source=source.type+':'+source.number;
  var icon=document.createElement('span');icon.className='input-icon';icon.innerHTML=source.type==='TV'?icons.tv:icons.input;
  var details=document.createElement('span');details.className='details';var title=document.createElement('span');title.className='input-title';title.textContent=inputName(source);
  var status=document.createElement('span');status.className='input-status';var dot=document.createElement('span');dot.className='dot'+(source.connected?' connected':'');status.appendChild(dot);status.appendChild(document.createTextNode(current?'Current input':source.connected?'Connected':'Not connected'));
  details.appendChild(title);details.appendChild(status);var arrow=document.createElement('span');arrow.className='input-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');el.appendChild(icon);el.appendChild(details);el.appendChild(arrow);return el;
 }
 function sourceMenuCard(){var el=button('Open Samsung sources',function(){destination('source-menu');},'input-card');el.innerHTML='<span class="input-icon">'+icons.input+'</span><span class="details"><span class="input-title">Samsung sources</span><span class="input-status">Choose a TV input</span></span><span class="input-arrow" aria-hidden="true">↗</span>';return el;}
 function renderInputs(){
  var active=document.activeElement,saved=active&&active.dataset.source,host=active&&active.closest('#home-inputs,#input-list');
  $('home-inputs').replaceChildren();$('input-list').replaceChildren();state.sources.forEach(function(s){$('input-list').appendChild(inputCard(s));});
  var selected=state.sources.filter(function(s){return s.connected;}).concat(state.sources.filter(function(s){return !s.connected;})).slice(0,3);
  selected.forEach(function(s){$('home-inputs').appendChild(inputCard(s));});if(!selected.length)$('home-inputs').appendChild(sourceMenuCard());
  $('input-note').textContent=state.inputError?'Input details are unavailable. Samsung sources can still open the TV’s own input chooser.':!state.inputsReady?'Reading your TV inputs…':!state.sources.length?'No inputs were reported. Open Samsung sources to choose an input.':'Connected status comes from your TV. Device names may appear as HDMI port numbers.';
  if(saved&&host)Array.prototype.some.call(host.children,function(el){if(el.dataset.source===saved){focus(el);return true;}return false;});
 }
 function refreshInputs(version){
  if(!onTV){state.sources=[{type:'HDMI',number:1,connected:true},{type:'HDMI',number:2,connected:true},{type:'HDMI',number:3,connected:false},{type:'HDMI',number:4,connected:false},{type:'TV',number:0,connected:true}];state.current={type:'HDMI',number:1};state.inputsReady=true;renderInputs();return;}
  try{
   try{state.current=tizen.tvwindow.getSource();}catch(e){console.info('SOURCE_CURRENT',e.name);}
   tizen.systeminfo.getPropertyValue('VIDEOSOURCE',function(info){if(version!==generation)return;var sources=[];(info.connected||[]).forEach(function(s){sources.push({type:s.type,number:s.number,connected:true,native:s});});(info.disconnected||[]).forEach(function(s){if(!sources.some(function(x){return same(x,s);}))sources.push({type:s.type,number:s.number,connected:false,native:s});});state.sources=sources.sort(function(a,b){return a.type.localeCompare(b.type)||a.number-b.number;});state.inputsReady=true;state.inputError=false;renderInputs();},function(e){if(version!==generation)return;console.error('SOURCE_LIST',e);state.inputError=true;state.inputsReady=true;renderInputs();});
  }catch(e){console.error('SOURCE_LIST',e);state.inputError=true;state.inputsReady=true;renderInputs();}
 }
 function refresh(){var version=++generation;
  if(!onTV){state.apps=favorites.map(function(f){return{id:f.id,name:f.name,show:true,brand:f.brand};}).concat([{id:destinations.store,name:'Samsung Apps',show:true,brand:'store'},{id:'demo.youtube',name:'YouTube',show:true},{id:'demo.disney',name:'Disney+',show:true},{id:'demo.appletv',name:'Apple TV',show:true},{id:'demo.spotify',name:'Spotify',show:true}]);state.ready=true;renderLibrary();refreshInputs(version);return;}
  try{tizen.application.getAppsInfo(function(list){if(version!==generation)return;state.apps=list;state.ready=true;renderLibrary();},function(e){console.error('APP_LIST',e);toast('Your app library could not be loaded. Samsung Home is still available.');});}catch(e){console.error('APP_LIST',e);toast('Your app library could not be loaded.');}refreshInputs(version);
 }
 function destination(key){launch(destinations[key],{store:'Samsung Apps',settings:'Samsung Settings','samsung-home':'Samsung Home','source-menu':'Samsung sources'}[key]);}
 function launch(id,name){
  if(!onTV){toast('Preview — opens '+name+' on your TV.');return;}if(state.busy)return;
  try{tizen.application.getAppInfo(id);}catch(e){console.error('APP_INFO',id,e);toast(name+' is unavailable. Open Samsung Apps or Samsung Home.');return;}
  state.busy=true;var timeout=setTimeout(function(){state.busy=false;},4000);
  function fail(error){state.busy=false;clearTimeout(timeout);console.error('APP_LAUNCH',id,error);toast('Could not open '+name+'. Samsung Home is still available.');}
  try{tizen.application.launch(id,function(){state.busy=false;clearTimeout(timeout);},fail);}catch(e){fail(e);}
 }
 function switchInput(source){
  if(!onTV){toast('Preview — switches to '+inputName(source)+' on your TV.');return;}if(state.busy)return;state.busy=true;var timeout=setTimeout(function(){state.busy=false;},5000);
  function fail(e){state.busy=false;clearTimeout(timeout);console.error('SOURCE_SWITCH',e);toast('Could not switch inputs. Use Samsung sources to choose this input.');}
  try{tizen.tvwindow.setSource(source.native||source,function(){state.busy=false;clearTimeout(timeout);try{tizen.application.getCurrentApplication().exit();}catch(e){toast('Input selected. Press Back to watch.');}},fail,'MAIN');}catch(e){fail(e);}
 }
 function showView(view,content){if(['home','apps','inputs','search','settings','airplay','wireless','weather'].indexOf(view)===-1)return;state.view=view;document.body.dataset.view=view;document.querySelectorAll('.view').forEach(function(s){s.hidden=s.id!=='view-'+view;s.classList.remove('view-enter');});var selected=$('view-'+view);selected.classList.add('view-enter');selected.scrollTop=0;document.querySelectorAll('nav [data-view]').forEach(function(b){if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(view==='search'){renderSearch();focus($('search'));}else if(content||view==='home'){var remembered=focusMemory[view];focus(remembered&&remembered.isConnected?remembered:selected.querySelector('[data-focus]'));}if(view==='inputs'&&onTV)refreshInputs(generation);}
 function focusable(){return Array.prototype.slice.call(document.querySelectorAll('[data-focus]')).filter(function(el){var r=el.getBoundingClientRect();return !el.hidden&&!el.disabled&&r.width&&r.height&&!el.closest('.view[hidden]');});}
 function move(direction,origin){var active=origin||document.activeElement,items=focusable();if(items.indexOf(active)===-1){focus(items[0]);return;}var grid=active.closest('.app-grid');if(grid){var siblings=Array.prototype.slice.call(grid.children),index=siblings.indexOf(active),columns=6,target=direction==='left'?index-1:direction==='right'?index+1:direction==='up'?index-columns:index+columns;if((direction==='left'&&index%columns>0)||(direction==='right'&&index%columns<columns-1&&target<siblings.length)||(direction==='up'&&target>=0)||(direction==='down'&&target<siblings.length)){focus(siblings[target]);return;}if(direction==='left'||direction==='right')return;}var a=active.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,best=null,score=Infinity;items.forEach(function(el){if(el===active)return;var b=el.getBoundingClientRect(),dx=b.left+b.width/2-ax,dy=b.top+b.height/2-ay,primary=direction==='left'?-dx:direction==='right'?dx:direction==='up'?-dy:dy,secondary=direction==='left'||direction==='right'?Math.abs(dy):Math.abs(dx);if(primary<2)return;var candidate=primary+secondary*3;if(candidate<score){score=candidate;best=el;}});focus(best);}
 document.querySelectorAll('[data-view]').forEach(function(b){b.addEventListener('click',function(){showView(b.dataset.view,!b.closest('nav'));});});
 document.querySelectorAll('[data-action]').forEach(function(b){b.addEventListener('click',function(){destination(b.dataset.action);});});
 $('search').addEventListener('input',renderSearch);$('clear-search').addEventListener('click',function(){$('search').value='';renderSearch();focus($('search'));});
 document.addEventListener('animationend',function(e){if(e.target.classList&&e.target.classList.contains('view-enter'))e.target.classList.remove('view-enter');});
document.addEventListener('keydown',function(e){var key=e.keyCode,active=document.activeElement,input=active===$('search');if(key===10009||key===27){e.preventDefault();if(input){$('search').blur();focus(document.querySelector('nav [data-view="search"]'));return;}if(state.view!=='home'){showView('home',true);return;}if(onTV){try{tizen.application.getCurrentApplication().exit();}catch(error){toast('Use Samsung Home to leave Quiet Home.');}}return;}if(input&&(key===37||key===39||key===38||key===13))return;if(active.matches('input[type=range]')&&(key===37||key===39))return;var directions={37:'left',38:'up',39:'right',40:'down'};if(directions[key]){e.preventDefault();if(input)$('search').blur();move(directions[key],active);}});
 document.addEventListener('focusin',function(e){var el=e.target,view=el.closest('.view');if(view)focusMemory[state.view]=el;if(state.view==='home'){if(el.closest('#favorites')){$('spotlight-title').textContent=el.getAttribute('aria-label');$('spotlight-hint').textContent=el.dataset.appId===destinations.store?'Search and download with Samsung Apps':'Press OK to open';}else if(el.closest('#home-inputs')){$('spotlight-title').textContent=el.getAttribute('aria-label');$('spotlight-hint').textContent='Press OK to switch input';}}});
 document.addEventListener('visibilitychange',function(){clearInterval(clockTimer);if(!document.hidden){clockTimer=setInterval(clock,30000);clock();state.busy=false;refresh();}});
 
 function renderHomeControls(){
  var paths={apps:'<rect x="6" y="6" width="15" height="15" rx="3"/><rect x="27" y="6" width="15" height="15" rx="3"/><rect x="6" y="27" width="15" height="15" rx="3"/><rect x="27" y="27" width="15" height="15" rx="3"/>',search:'<circle cx="21" cy="21" r="13"/><path d="m31 31 12 12"/>',inputs:'<rect x="4" y="8" width="40" height="28" rx="4"/><path d="M16 43h16m-8-7v7M15 22h18m-6-6 6 6-6 6"/>',settings:'<path d="m19 5 1-3h8l1 3 1 5 5 3 5-1 4 7-4 4v5l4 4-4 7-5-1-5 3-1 5h-10l-1-5-5-3-5 1-4-7 4-4v-5l-4-4 4-7 5 1 5-3Z"/><circle cx="24" cy="25" r="7"/>',home:'<path d="m5 23 19-16 19 16M11 20v23h26V20M20 43V29h8v14"/>',tv:'<rect x="5" y="7" width="38" height="28" rx="4"/><path d="M16 42h16m-8-7v7M17 21h14m-7-7v14"/>'};
  [{name:'All Apps',label:'Apps',view:'apps',icon:'apps'},{name:'Search',label:'Search apps',view:'search',icon:'search'},{name:'Inputs',view:'inputs',icon:'inputs'},{name:'Appearance',label:'Quiet Home settings',view:'settings',icon:'settings'},{name:'TV Settings',label:'Samsung Settings',action:'settings',icon:'tv'},{name:'Samsung Home',action:'samsung-home',icon:'home'}].forEach(function(item){
   var el=button(item.label||item.name,function(){if(item.view)showView(item.view,true);else destination(item.action);},'app utility utility-'+item.icon);el.dataset.control=item.view||item.action;
   var tile=document.createElement('span');tile.className='tile';tile.innerHTML='<span class="tile-art"><svg viewBox="0 0 48 48" aria-hidden="true">'+paths[item.icon]+'</svg></span>';
   var label=document.createElement('span');label.className='app-label';label.textContent=item.name;el.appendChild(tile);el.appendChild(label);$('favorites').appendChild(el);
  });
 }
 var pressed;
 document.addEventListener('keydown',function(e){if(e.keyCode===13&&document.activeElement.classList.contains('app')){pressed=document.activeElement;pressed.classList.add('pressing');}});
 document.addEventListener('keyup',function(e){if(e.keyCode===13&&pressed){var released=pressed;setTimeout(function(){released.classList.remove('pressing');},90);pressed=null;}});
 window.addEventListener('blur',function(){document.querySelectorAll('.pressing').forEach(function(el){el.classList.remove('pressing');});});

 var clockTimer;window.addEventListener('pagehide',function(){clearInterval(clockTimer);});
 function clock(){var now=new Date();$('clock').textContent=now.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',timeZone:'America/Los_Angeles'});$('header-date').textContent=now.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric',timeZone:'America/Los_Angeles'});}
 renderApps($('favorites'),favorites.concat([{id:destinations.store,name:'Samsung Apps',brand:'store'}]));renderHomeControls();$('preview-badge').hidden=onTV;clock();if(!document.hidden)clockTimer=setInterval(clock,30000);refresh();focus($('favorites').querySelector('button'));
 window.QuietHome={version:'0.8.0',refresh:refresh,getState:function(){return{view:state.view,appsReady:state.ready,appCount:library().length,inputsReady:state.inputsReady,inputError:state.inputError,sources:state.sources.map(function(s){return{type:s.type,number:s.number,connected:s.connected};}),current:state.current};}};
}());
