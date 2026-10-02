import { Router } from 'express'

const router = Router()

router.get('/track.js', (_req, res) => {
  const apiUrl = (process.env.PUBLIC_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')
  const script = `(function(){
  var s=document.currentScript;
  var siteKey=s&&s.getAttribute('data-site-key');
  var secret=s&&s.getAttribute('data-site-secret');
  if(!siteKey||!secret)return;
  var apiUrl='${apiUrl}';
  var visitorKey='sl_visitor_'+siteKey;
  function getCookie(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null;}
  function setCookie(n,v,d){var e=new Date();e.setTime(e.getTime()+d*864e5);document.cookie=n+'='+encodeURIComponent(v)+';expires='+e.toUTCString()+';path=/;SameSite=Lax';}
  function uuid(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});}
  var visitorId=getCookie(visitorKey)||uuid();
  setCookie(visitorKey,visitorId,365);
  var sessionId=sessionStorage.getItem('sl_session_'+siteKey);
  if(!sessionId){sessionId=uuid();sessionStorage.setItem('sl_session_'+siteKey,sessionId);}
  var pageStart=Date.now();
  var currentPath=location.pathname+location.search;
  function device(){var w=window.innerWidth;return w<768?'mobile':w<1024?'tablet':'desktop';}
  function browser(){var ua=navigator.userAgent;if(ua.indexOf('Firefox')>-1)return'Firefox';if(ua.indexOf('Edg')>-1)return'Edge';if(ua.indexOf('Chrome')>-1)return'Chrome';if(ua.indexOf('Safari')>-1)return'Safari';return'Other';}
  function send(events){
    var body=JSON.stringify({siteKey:siteKey,siteSecret:secret,events:events});
    if(navigator.sendBeacon){
      var blob=new Blob([body],{type:'application/json'});
      if(navigator.sendBeacon(apiUrl+'/api/ingest/events',blob))return;
    }
    fetch(apiUrl+'/api/ingest/events',{method:'POST',headers:{'Content-Type':'application/json','X-Site-Key':siteKey,'X-Site-Secret':secret},body:body,keepalive:true}).catch(function(){});
  }
  function track(type,extra){
    var evt=Object.assign({type:type,sessionId:sessionId,visitorId:visitorId,timestamp:new Date().toISOString()},extra||{});
    send([evt]);
  }
  track('session_start',{referrer:document.referrer||'direct',device:device(),browser:browser()});
  track('page_view',{path:currentPath,title:document.title,referrer:document.referrer||'direct'});
  var heartbeat=setInterval(function(){
    var dwell=Math.round((Date.now()-pageStart)/1000);
    track('heartbeat',{path:currentPath,dwellSec:dwell});
  },30000);
  function onLeave(){
    clearInterval(heartbeat);
    var dwell=Math.round((Date.now()-pageStart)/1000);
    track('page_leave',{path:currentPath,dwellSec:dwell});
    track('session_end',{dwellSec:dwell});
  }
  window.addEventListener('pagehide',onLeave);
  window.addEventListener('beforeunload',onLeave);
  var _push=history.pushState;
  history.pushState=function(){
    onLeave();
    pageStart=Date.now();
    currentPath=location.pathname+location.search;
    _push.apply(history,arguments);
    track('page_view',{path:currentPath,title:document.title});
  };
  window.addEventListener('popstate',function(){
    onLeave();
    pageStart=Date.now();
    currentPath=location.pathname+location.search;
    track('page_view',{path:currentPath,title:document.title});
  });
})();`

  res.setHeader('Content-Type', 'application/javascript')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.send(script)
})

export default router
