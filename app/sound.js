(function(){
 'use strict';
 var settings={enabled:true,volume:25},key='quiet-home.sound.v1',context=null,idleTimer=null,intentUntil=0,lastSound=-1000,played=0;
 try{var saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){if(typeof saved.enabled==='boolean')settings.enabled=saved.enabled;if(Number.isFinite(saved.volume)&&saved.volume>=0&&saved.volume<=100)settings.volume=saved.volume;}}catch(e){}
 function close(){clearTimeout(idleTimer);idleTimer=null;intentUntil=0;if(context){var old=context;context=null;try{old.close().catch(function(){});}catch(e){}}}
 function audio(){if(!settings.enabled||!settings.volume||document.hidden)return null;var Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;try{if(!context||context.state==='closed')context=new Audio();if(context.state==='suspended')context.resume().catch(function(){});return context;}catch(e){return null;}}
 function play(kind){var now=performance.now();if(now-lastSound<65)return;var ctx=audio();if(!ctx)return;lastSound=now;try{var start=ctx.currentTime,duration=kind==='select'?.075:kind==='back'?.055:.038,osc=ctx.createOscillator(),gain=ctx.createGain(),frequency=kind==='select'?740:kind==='back'?430:920;
  osc.type='sine';osc.frequency.setValueAtTime(frequency,start);osc.frequency.exponentialRampToValueAtTime(kind==='select'?1040:frequency*.78,start+duration);
  gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.085*(settings.volume/100),start+.003);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.005);osc.onended=function(){osc.disconnect();gain.disconnect();};played++;
  clearTimeout(idleTimer);idleTimer=setTimeout(close,800);
 }catch(e){close();}}
 function sync(save){document.querySelectorAll('[data-sound-enabled]').forEach(function(b){b.setAttribute('aria-pressed',String(String(settings.enabled)===b.dataset.soundEnabled));});document.getElementById('sound-volume').value=settings.volume;document.getElementById('sound-volume-value').textContent=settings.volume+'%';if(save){try{localStorage.setItem(key,JSON.stringify(settings));}catch(e){}}}
 document.addEventListener('keydown',function(e){if(e.repeat&&e.keyCode===13)return;if([37,38,39,40].indexOf(e.keyCode)!==-1){audio();intentUntil=performance.now()+250;}else if(e.keyCode===13)play('select');else if(e.keyCode===27||e.keyCode===10009)play('back');},true);
 document.addEventListener('pointerdown',function(){audio();intentUntil=performance.now()+250;},true);
 document.addEventListener('focusin',function(e){if(performance.now()<intentUntil&&e.target.matches('[data-focus]'))play('move');});
 document.querySelectorAll('[data-sound-enabled]').forEach(function(b){b.addEventListener('click',function(){settings.enabled=b.dataset.soundEnabled==='true';sync(true);if(!settings.enabled)close();else play('select');});});
 document.getElementById('sound-volume').addEventListener('input',function(e){settings.volume=Number(e.target.value);sync(true);if(!settings.volume)close();else play('move');});
 document.getElementById('preview-sound').addEventListener('click',function(){play('select');});
 document.addEventListener('visibilitychange',function(){if(document.hidden)close();});window.addEventListener('pagehide',close);sync(false);
 window.QuietHomeSound={preview:function(){play('select');},getState:function(){return{enabled:settings.enabled,volume:settings.volume,available:!!(window.AudioContext||window.webkitAudioContext),contextState:context?context.state:'closed',soundsPlayed:played};}};
}());
