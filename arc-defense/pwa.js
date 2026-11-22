(()=>{
 'use strict';const VERSION='9.63.0';let registration=null,deferredInstall=null,offlineReady=false,waiting=null,queued=false,applying=false,reloadPending=false,returnFocus=null,incoming=null,offlineError='';
 const $=id=>document.getElementById(id),busy=()=>window.arcAppState?.().busy!==false;
 const isInstalled=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function tell(text){$('arcAppMessage').textContent=text}
 function lock(){if(window.arcAppPrepareUpdate?.()!==true)return false;document.body.classList.add('arc-app-updating');return true}
 function unlock(){window.arcAppCancelUpdate?.();document.body.classList.remove('arc-app-updating');applying=false}
 function render(){
  $('arcAppVersion').textContent='VERSION '+VERSION+(isInstalled()?' · INSTALLED':' · WEB APP');
  $('arcAppOffline').textContent=offlineReady?'✓ Downloaded · Ready for offline play':offlineError|| (navigator.onLine?'Preparing offline files…':'Offline play is not ready yet. Connect and reopen the game.');
  $('arcAppNetwork').textContent=navigator.onLine?'Network available':'You are offline';
  $('arcAppInstall').hidden=isInstalled();$('arcAppInstall').textContent=deferredInstall?'Install ARC DEFENSE':'How to install';
  $('arcAppUpdate').hidden=!waiting;$('arcAppUpdate').disabled=applying;$('arcAppUpdate').textContent=queued?'Update queued':busy()?'Update after this run':'Update now';
  $('arcAppImport').disabled=busy();$('arcAppMerge').disabled=busy()||!incoming;
  $('arcAppImportHint').textContent=busy()?'Finish your current defense before importing.':'Merge a backup at the menu. Your better scores are kept.';
  $('arcAppEntryStatus').textContent=waiting?'New version available':isInstalled()?'Installed · '+VERSION:offlineReady?'Offline ready · '+VERSION:'Install · Offline · Updates';
 }
 function show(){returnFocus=document.activeElement;$('arcAppDialog').hidden=false;render();$('arcAppClose').focus()}
 function close(){$('arcAppDialog').hidden=true;returnFocus?.focus?.()}
 function offer(worker){waiting=worker;render();tell('A new version has downloaded. Apply it at the menu, or queue it for after your run.')}
 async function check(){if(!registration){tell('Offline features need a supported browser and a secure connection.');return}try{tell('Checking for updates…');await registration.update();if(registration.waiting)offer(registration.waiting);else tell('Update check complete. Any new version will appear here once downloaded.')}catch(e){tell('Unable to check right now. Your downloaded game remains available.')}}
 function apply(){if(!waiting||applying)return;if(busy()){queued=true;tell('Update queued. Your current defense will continue.');render();return}applying=true;render();waiting.postMessage({type:'ARC_APPLY_UPDATE'});setTimeout(()=>{if(applying&&!document.body.classList.contains('arc-app-updating')){applying=false;render()}},4000)}
 function watch(worker){if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)offer(worker)})}
 async function setupWorker(){
  if(!('serviceWorker' in navigator)||!window.isSecureContext){offlineError='Offline installation is unavailable in this browser.';render();return}
  const hadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('message',event=>{
   if(event.data?.type==='ARC_PREPARE_UPDATE'){event.ports[0]?.postMessage({safe:lock()});return}
   if(event.data?.type==='ARC_UPDATE_BLOCKED'){unlock();queued=false;tell('Finish the defense in your other ARC DEFENSE tabs, or close those tabs, then try again.');render()}
  });
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController||applying){if(!busy())location.reload();else{reloadPending=true;tell('New version ready. Reload will wait until your defense ends.')}}});
  try{
   registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));if(registration.waiting)offer(registration.waiting);
   const ready=await navigator.serviceWorker.ready;
   const reply=await new Promise(resolve=>{const channel=new MessageChannel(),timer=setTimeout(()=>resolve(null),3500);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data)};ready.active?.postMessage({type:'ARC_STATUS'},[channel.port2])});offlineReady=reply?.offline===true;render();
  }catch(e){offlineError='Offline files are not ready. Reconnect and reopen to try again.';render();tell('Offline files could not be downloaded. Reconnect and reopen the game to try again.')}
 }
 function boot(){
  const dialog=document.createElement('section');dialog.id='arcAppDialog';dialog.hidden=true;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','arcAppTitle');dialog.innerHTML=`<div class="arc-app-panel"><div class="arc-app-head"><img src="./icon-192.png" width="58" height="58" alt=""><div><small id="arcAppVersion"></small><h2 id="arcAppTitle">Take your defense anywhere.</h2></div><button id="arcAppClose" aria-label="Close application settings">×</button></div><div class="arc-app-status"><strong id="arcAppOffline"></strong><span id="arcAppNetwork"></span></div><div class="arc-app-actions"><button id="arcAppInstall">Install ARC DEFENSE</button><button id="arcAppCheck">Check for updates</button><button id="arcAppUpdate" hidden>Update now</button></div><p id="arcAppMessage" role="status">Install once. New versions download when you are online. Updates wait for your defense to finish.</p><div id="arcAppInstallHelp" hidden><strong>Install on your device</strong><p>Android / desktop: open the browser menu and choose “Install app” or “Install page as app”.<br>iPhone / iPad: in Safari, tap Share → Add to Home Screen, then enable “Open as Web App” if offered.</p></div><section class="arc-app-backup"><small>KEEP YOUR PROGRESS</small><h3>Your victories travel with you.</h3><p>Backups include campaign progress, circuit records and settings. The current defense is not saved. Export before switching device or installing on iPhone.</p><div class="arc-app-actions"><button id="arcAppExport">Export progress</button><button id="arcAppImport">Import progress</button></div><input type="file" id="arcAppFile" accept="application/json,.json" hidden><p id="arcAppImportHint"></p><div id="arcAppReview" hidden><strong>Backup ready to merge</strong><p id="arcAppReviewText"></p><button id="arcAppMerge">Merge progress &amp; reload</button><button id="arcAppCancelImport">Cancel import</button></div></section></div>`;document.body.append(dialog);
  const entry=document.createElement('div');entry.className='arc-app-entry';entry.innerHTML='<img src="./icon-192.png" width="36" height="36" alt=""><div><strong>ARC DEFENSE · APP</strong><small id="arcAppEntryStatus">Install · Offline · Updates</small></div><button type="button" id="arcAppOpen">Install / Updates</button>';
  const overview=$('campaignOverview');if(overview)overview.parentElement.insertBefore(entry,overview);
  const option=document.createElement('button');option.type='button';option.textContent='App · Install, updates & backups';option.onclick=show;document.querySelector('#arc917Settings .arc917-options')?.prepend(option);
  $('arcAppOpen').onclick=show;$('arcAppClose').onclick=close;$('arcAppCheck').onclick=check;$('arcAppUpdate').onclick=apply;
  $('arcAppInstall').onclick=async()=>{if(deferredInstall){const prompt=deferredInstall;deferredInstall=null;await prompt.prompt();const choice=await prompt.userChoice;tell(choice.outcome==='accepted'?'Installation requested. Open ARC DEFENSE from your app launcher.':'You can install later from this menu.');render()}else{$('arcAppInstallHelp').hidden=false;tell('Follow the installation steps below. Browser installation options vary by device.')}};
  $('arcAppExport').onclick=()=>{try{const blob=new Blob([ArcProgress.export(localStorage)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='arc-defense-progress-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);tell('Backup exported. Keep the JSON file to restore or transfer your progress.')}catch(e){tell('Progress could not be exported. Check that storage and downloads are allowed.')}};
  $('arcAppImport').onclick=()=>{if(!busy())$('arcAppFile').click()};
  $('arcAppFile').onchange=async event=>{const file=event.target.files[0];incoming=null;$('arcAppReview').hidden=true;if(!file)return;try{if(file.size>524288)throw Error('Backup exceeds 512 KB.');incoming=ArcProgress.parse(await file.text());const campaign=incoming.arc_campaign_v1,circuits=Object.keys(incoming).filter(k=>k.startsWith('arc_free_v1_')).length;$('arcAppReviewText').textContent=file.name+' · '+Object.keys(campaign?.cleared||{}).length+' campaign stages · '+circuits+' circuit records. Better existing scores will be kept. The game will reload after merging.';$('arcAppReview').hidden=false;tell('Review the backup before applying it.')}catch(e){tell(e.message)}finally{event.target.value='';render()}};
  $('arcAppCancelImport').onclick=()=>{incoming=null;$('arcAppReview').hidden=true;render()};
  $('arcAppMerge').onclick=()=>{if(!incoming||busy())return;try{ArcProgress.write(localStorage,ArcProgress.merge(ArcProgress.read(localStorage),incoming));location.reload()}catch(e){tell(e.message)}};
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button:not(:disabled)')].filter(b=>b.getClientRects().length);if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  render();setupWorker();setInterval(()=>{render();if(reloadPending&&!busy())location.reload();if(queued&&waiting&&!busy())apply()},1000);setInterval(()=>{if(navigator.onLine)registration?.update().catch(()=>{})},300000);
  window.addEventListener('online',()=>{render();registration?.update().catch(()=>{})});window.addEventListener('offline',render);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine)registration?.update().catch(()=>{})});
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if($('arcAppInstall'))render()});window.addEventListener('appinstalled',()=>{deferredInstall=null;render();tell('ARC DEFENSE is installed. Open it from your app launcher.')});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(boot),{once:true});else requestAnimationFrame(boot);
})();


