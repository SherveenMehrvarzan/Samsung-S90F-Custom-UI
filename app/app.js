(function () {
  'use strict';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('button[data-key]'));
  var apps = [], ready = false, timer, busy = false;
  var matches = {
    netflix: [/^netflix$/i], hbo: [/^hbo\s*max$/i, /^max$/i, /^hbo$/i],
    prime: [/^(amazon\s+)?prime\s*video$/i, /^amazon video$/i],
    hulu: [/^hulu$/i], twitch: [/^twitch(\s*tv)?$/i],
    settings: [/^(samsung\s+)?settings$/i], home: [/^(samsung\s+)?(smart\s*hub|home)$/i]
  };
  // Observed in this S90F's installed-app list. Only use an ID if the TV's
  // application API also returns it; name matching remains a portable fallback.
  var preferred = {
    netflix:'org.tizen.netflix-app', hbo:'5b8c3eb16b.BeamCTVDev',
    prime:'org.tizen.primevideo', hulu:'LBUAQX1exg.Hulu',
    twitch:'Jz7aUrV2Q4.Twitch', settings:'org.tizen.menu',
    home:'com.samsung.tv.csfs'
  };
  function toast(message) {
    var el = document.getElementById('toast'); el.textContent = message; el.hidden = false;
    clearTimeout(timer); timer = setTimeout(function () { el.hidden = true; }, 5500);
  }
  function clock() { document.getElementById('clock').textContent = new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}); }
  function onTV() { return !!(window.tizen && window.tizen.application); }
  function discover() {
    if (!onTV()) { ready = true; return; }
    try {
      tizen.application.getAppsInfo(function (list) {
        apps = list; ready = true;
        console.info('QUIET_HOME_APPS', JSON.stringify(list.map(function (a) { return {id:a.id,name:a.name}; })));
      }, function (error) { ready = false; console.error(error); toast('Could not read your apps. Return to Samsung Home and reopen Quiet Home.'); });
    } catch (error) { ready = false; console.error(error); toast('App access is unavailable. Use the remote’s Home button.'); }
  }
  function candidates(key) {
    // Samsung system destinations must be verified on the connected TV before
    // any Home-button reassignment. Never substitute the launcher's own ID.
    var ownId = onTV() ? tizen.application.getCurrentApplication().appInfo.id : '';
    var exact = apps.filter(function (app) { return app.id === preferred[key] && app.id !== ownId; });
    if (exact.length === 1) return exact;
    var found = apps.filter(function (app) {
      return app.id !== ownId && matches[key].some(function (re) { return re.test(app.name.trim()); });
    });
    if (key === 'home') {
      var hub = apps.filter(function (a) { return a.id === 'com.samsung.tv.csfs'; });
      if (hub.length) return hub;
    }
    return found;
  }
  function activate(key) {
    if (!onTV()) { toast('Preview only — ' + ({netflix:'Netflix',hbo:'HBO Max',prime:'Prime Video',hulu:'Hulu',twitch:'Twitch',settings:'Samsung Settings',home:'Samsung Home'})[key]); return; }
    if (!ready) { toast('Your apps are still loading. Try again in a moment.'); discover(); return; }
    if (busy) return;
    var found;
    try { found = candidates(key); } catch (e) { console.error(e); toast('Could not read your apps. Use the remote’s Home button.'); return; }
    if (!found.length) {
      toast(key === 'settings' ? 'Use the remote’s Settings button, or open Samsung Home.' : key === 'home' ? 'Press Home on your Samsung remote.' : 'This app was not found. Open Samsung Home to check that it is installed.'); return;
    }
    if (found.length > 1) { toast('Multiple matching apps found. This shortcut needs to be checked on your TV.'); return; }
    busy = true;
    var release = setTimeout(function () { busy = false; }, 4000);
    try {
      tizen.application.launch(found[0].id, function () { busy = false; clearTimeout(release); }, function (error) {
        busy = false; clearTimeout(release); console.error(error); toast('Unable to open this shortcut. Use Samsung Home.');
      });
    } catch (error) { busy = false; clearTimeout(release); console.error(error); toast('Unable to open this shortcut. Use Samsung Home.'); }
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { activate(button.dataset.key); }); });
  document.addEventListener('keydown', function (e) {
    var index = buttons.indexOf(document.activeElement), next = Math.max(0, index), key = e.keyCode;
    if (key === 37) next = index < 5 ? Math.max(0,index-1) : 5;
    else if (key === 39) next = index < 5 ? Math.min(4,index+1) : 6;
    else if (key === 40) next = index < 5 ? (index < 3 ? 5 : 6) : index;
    else if (key === 38) next = index >= 5 ? (index === 5 ? 0 : 4) : index;
    else if (key === 10009 || key === 27) {
      e.preventDefault();
      // This is a standalone test app. Back exits normally; it never changes
      // system Home/startup preferences.
      if (onTV()) { try { tizen.application.getCurrentApplication().exit(); } catch (error) { toast('Press Home on your Samsung remote.'); } }
      else buttons[0].focus();
      return;
    } else return; // Enter/Space use native button activation, avoiding double launch.
    e.preventDefault(); buttons[next].focus();
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { busy = false; discover(); } });
  clock(); setInterval(clock, 30000); discover(); buttons[0].focus();
}());
