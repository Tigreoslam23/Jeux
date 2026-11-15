// Run with: node arc-defense/tests/fullscreen-controls.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=source.match(/<script id="arc929-fullscreen">([\s\S]*?)<\/script>/)[1];
function setup({supported=true,reject=false}={}){
 const events={},buttons=[],timers=[],requests=[];let exits=0;
 const element=()=>({hidden:false,attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,v){this[k]=v},insertBefore(b){buttons.push(b)},append(){}});
 const map=element();map.id='campaignFullscreen';buttons.push(map);
 const options=element(),notice=[];
 const document={readyState:'complete',fullscreenEnabled:supported,fullscreenElement:null,documentElement:{requestFullscreen:async opts=>{requests.push(opts);if(reject)throw new TypeError('not granted');document.fullscreenElement=document.documentElement}},exitFullscreen:async()=>{exits++;document.fullscreenElement=null},body:{append(el){notice.push(el)}},createElement:element,querySelector:()=>options,querySelectorAll:()=>buttons,addEventListener(k,v){events[k]=v}};
 vm.runInNewContext(script,{document,window:{addEventListener(){}},setTimeout(fn){timers.push(fn);return timers.length},clearTimeout(){},console:{warn(){}}});
 return {document,buttons,requests,notice,events,get exits(){return exits},clickMap:()=>events.click({target:{closest:()=>map}}),settle:()=>new Promise(resolve=>setImmediate(resolve))};
}
(async()=>{
 const s=setup();assert.equal(s.requests.length,0,'no automatic fullscreen');
 s.clickMap();s.clickMap();await s.settle();assert.equal(s.requests.length,1,'duplicate taps ignored');assert.equal(s.requests[0].navigationUI,'hide');
 for(const b of s.buttons){assert.equal(b.attrs['aria-pressed'],'true');assert.match(b.textContent,/Exit full screen/);assert.equal(b.disabled,false)}
 await s.buttons[1].click();assert.equal(s.exits,1);assert.equal(s.document.fullscreenElement,null);assert.equal(s.buttons[0].attrs['aria-pressed'],'false');
 await s.buttons[1].click();assert.equal(s.requests.length,2);s.document.fullscreenElement=null;s.events.fullscreenchange();assert.equal(s.buttons[1].attrs['aria-pressed'],'false','external exit updates controls');
 const r=setup({reject:true});r.clickMap();await r.settle();assert.equal(r.notice[0].hidden,false);assert.match(r.notice[0].textContent,/blocked/);assert.equal(r.buttons[0].disabled,false);assert.equal(r.buttons[0].attrs['aria-pressed'],'false');
 const u=setup({supported:false});u.clickMap();await u.settle();assert.equal(u.requests.length,0);assert.match(u.notice[0].textContent,/unavailable/);
 console.log('Fullscreen controls passed: user activation, hidden browser UI request, duplicate taps, both controls, exit, external exit, rejection and unavailable API.');
})();
