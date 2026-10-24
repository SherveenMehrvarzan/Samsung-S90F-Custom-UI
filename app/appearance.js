(function(){
 'use strict';
 var themes=[{id:'midnight',name:'Midnight',hue:215,top:'#273b5d',bottom:'#0b1428'},{id:'ocean',name:'Ocean',hue:185,top:'#245664',bottom:'#071e2b'},{id:'amethyst',name:'Amethyst',hue:275,top:'#503562',bottom:'#1a102e'},{id:'forest',name:'Forest',hue:145,top:'#315d48',bottom:'#0b201b'},{id:'slate',name:'Slate',hue:220,top:'#4a5262',bottom:'#161b24',saturation:.12},{id:'sunset',name:'Sunset',hue:18,top:'#80515a',bottom:'#28182d'}];
 var defaults={preset:'midnight',hue:215,mode:'landscape',brightness:100},settings=Object.assign({},defaults),key='quiet-home.appearance.v1';
 try{var saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){if(themes.some(function(t){return t.id===saved.preset;})||saved.preset==='custom')settings.preset=saved.preset;if(Number.isFinite(saved.hue)&&saved.hue>=0&&saved.hue<=360)settings.hue=saved.hue;if(saved.mode==='landscape'||saved.mode==='gradient')settings.mode=saved.mode;if(Number.isFinite(saved.brightness)&&saved.brightness>=40&&saved.brightness<=100)settings.brightness=saved.brightness;}}catch(e){console.info('APPEARANCE_LOAD',e.name);}
 function apply(persist){
  var theme=themes.filter(function(t){return t.id===settings.preset;})[0],root=document.documentElement;
  document.body.dataset.background=settings.mode;
  root.style.setProperty('--wallpaper-hue',(settings.hue-215)+'deg');root.style.setProperty('--wallpaper-saturation',theme&&theme.saturation||1);root.style.setProperty('--background-brightness',settings.brightness/100);
  root.style.setProperty('--color-top',theme?theme.top:'hsl('+settings.hue+', 38%, 29%)');root.style.setProperty('--color-bottom',theme?theme.bottom:'hsl('+((settings.hue+20)%360)+', 45%, 10%)');
  document.querySelectorAll('[data-theme]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.theme===settings.preset));});
  document.querySelectorAll('[data-background-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.backgroundMode===settings.mode));});
  document.getElementById('background-hue').value=settings.hue;document.getElementById('background-brightness').value=settings.brightness;
  document.getElementById('hue-value').textContent=theme?theme.name:'Custom';document.getElementById('brightness-value').textContent=settings.brightness+'%';
  if(persist){try{localStorage.setItem(key,JSON.stringify(settings));}catch(e){console.error('APPEARANCE_SAVE',e.name);document.getElementById('appearance-status').textContent='This color is applied, but could not be saved on this TV.';}}
 }
 themes.forEach(function(theme){var b=document.createElement('button');b.setAttribute('data-focus','');b.dataset.theme=theme.id;b.className='theme-swatch';b.setAttribute('aria-label',theme.name+' background');var sample=document.createElement('span');sample.className='swatch-sample';sample.style.background='linear-gradient(145deg,'+theme.top+','+theme.bottom+')';var name=document.createElement('span');name.textContent=theme.name;b.appendChild(sample);b.appendChild(name);b.addEventListener('click',function(){settings.preset=theme.id;settings.hue=theme.hue;apply(true);});document.getElementById('theme-palette').appendChild(b);});
 document.querySelectorAll('[data-background-mode]').forEach(function(b){b.addEventListener('click',function(){settings.mode=b.dataset.backgroundMode;apply(true);});});
 document.getElementById('background-hue').addEventListener('input',function(e){settings.preset='custom';settings.hue=Number(e.target.value);apply(true);});
 document.getElementById('background-brightness').addEventListener('input',function(e){settings.brightness=Number(e.target.value);apply(true);});
 document.getElementById('reset-appearance').addEventListener('click',function(){settings=Object.assign({},defaults);apply(true);});
 apply(false);window.QuietHomeAppearance={getState:function(){return Object.assign({},settings);}};
}());
