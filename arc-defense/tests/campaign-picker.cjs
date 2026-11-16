// Run with: node arc-defense/tests/campaign-picker.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const helpers=source.slice(source.indexOf('function campaignOverviewData('),source.indexOf('function openCampaignMap('));
const openCode=source.slice(source.indexOf('function openCampaignMap('),source.indexOf('function mountCampaignControls('));
const gate=source.match(/function canPlayStage[^\n]+/)[0],budget=source.match(/function campaignStageBudget[^\n]+/)[0];
function fixture(progress){
 let document;
 class Node{
  constructor(tag='div',id='',cls=''){Object.assign(this,{tagName:tag.toUpperCase(),id,className:cls,children:[],parentElement:null,hidden:false,disabled:false,style:{},dataset:{},attrs:{},textContent:'',scrollTop:99});this.classList={add:c=>this.className+=' '+c,toggle:(c,on)=>this.className=this.className.split(' ').filter(x=>x!==c).concat(on?[c]:[]).join(' ')}}
  get nextElementSibling(){return this.parentElement?.children[this.parentElement.children.indexOf(this)+1]||null}
  append(...nodes){for(const n of nodes)this.insertBefore(n,null)}
  insertBefore(n,before){if(n.parentElement){const a=n.parentElement.children;a.splice(a.indexOf(n),1)}n.parentElement=this;const i=before?this.children.indexOf(before):this.children.length;this.children.splice(i<0?this.children.length:i,0,n)}
  setAttribute(k,v){this.attrs[k]=String(v)}
  querySelectorAll(selector){const out=[],match=n=>selector==='button:not(:disabled)'?n.tagName==='BUTTON'&&!n.disabled:selector[0]==='.'?n.className.split(' ').includes(selector.slice(1)):selector[0]==='#'?n.id===selector.slice(1):false;const visit=n=>{for(const x of n.children){if(match(x))out.push(x);visit(x)}};visit(this);return out}
  querySelector(s){return this.querySelectorAll(s)[0]||null}
  getClientRects(){for(let n=this;n;n=n.parentElement)if(n.hidden)return [];return [{}]}
  focus(){assert(this.getClientRects().length,'Hidden focus '+this.id);document.activeElement=this}
  set innerHTML(html){this.children=[];for(const m of html.matchAll(/id="([^"]+)"/g)){const x=new Node('span',m[1]);if(m[1].includes('Meter')){const wrap=new Node('span');this.append(wrap);wrap.append(x)}else this.append(x)}}
 }
 const body=new Node('body');document={body,activeElement:null,createElement:t=>new Node(t),getElementById:id=>body.querySelector('#'+id)};
 const node=(t,id,c)=>new Node(t,id,c),map=node('section','campaignMap'),panel=node('div','','campaign-map-panel');map.hidden=true;map.append(panel);body.append(map,node('button','pause'));
 const head=node('div','','campaign-map-head');head.append(node('button','campaignFullscreen'),node('button','campaignClose'));panel.append(head,node('h2','campaignMapTitle'),node('p','campaignCompletion','campaign-map-intro'),node('p','','campaign-map-intro'));
 const refs=[];
 for(const id of [1,2]){
  panel.append(node('h3','','campaign-section-title'));if(id===2)panel.append(node('p','campaignCompletion2','campaign-map-intro'),node('p','','campaign-map-intro'));
  const route=node('div','','campaign-route');panel.append(route);
  for(let n=(id===1?1:6);n<=(id===1?5:10);n++){const item=node('article',n===1?'':'campaignStage'+n,'campaign-stage'),play=node('button',n===1?'campaignPlay':'campaignPlay'+n);play.onclick=()=>document.lastStage=n;item.append(node('span'),node('div'),node('p',n===1?'campaignStageResult':'campaignStage'+n+'Result'),play);route.append(item);refs.push(play)}
 }
 panel.append(node('button','campaignClassic'),node('p','','campaign-map-foot'));
 const frames=[],$=id=>document.getElementById(id);
 const prelude="const $=id=>document.getElementById(id);let playing=false,paused=false,campaignMenuWasPaused=false;function activeStage(){return 1}\n";
 const tail="\nreturn {mountCampaignPicker,showCampaignPicker,showCampaignStages,campaignOverviewData,openCampaignMap,closeCampaignMap,visibleCampaignButtons,setPlaying(v,p=false){playing=v;paused=p},state:()=>({playing,paused})};";
 const api=new Function('document','campaignProgress','requestAnimationFrame','window',prelude+gate+'\n'+budget+'\n'+helpers+'\n'+openCode+tail)(document,progress,fn=>frames.push(fn),{arcAudio:{pause(){}}});
 return {document,$,api,refs,flush(){while(frames.length)frames.shift()()}};
}
const progress={cleared:{'1':true,'2':true},best:{'1':{stars:2},'2':{stars:3}}},before=JSON.stringify(progress),f=fixture(progress);
f.api.mountCampaignPicker();f.api.openCampaignMap();f.flush();
assert.equal(f.$('campaignOverview').children.length,2);assert.equal(f.$('campaignMap').dataset.campaign,'overview');assert(f.$('campaignBack').hidden);
assert(f.$('campaignStages1').hidden&&f.$('campaignStages2').hidden);assert.equal(f.document.activeElement.id,'campaignChoose1');
assert.equal(f.api.campaignOverviewData(1).stars,5);assert.equal(f.api.campaignOverviewData(1).cleared,2);assert.match(f.$('campaignOverviewNext1').textContent,/Stage 03/);assert.equal(f.api.campaignOverviewData(2).stars,0);
assert.equal(f.$('campaignStages1').querySelectorAll('button:not(:disabled)').length,3);
for(const id of [1,2]){
 f.$('campaignChoose'+id).onclick();f.flush();assert.equal(f.$('campaignMap').dataset.campaign,String(id));assert(f.$('campaignOverview').hidden);assert(!f.$('campaignStages'+id).hidden);assert(f.$('campaignStages'+(3-id)).hidden);
 assert.equal(f.$('campaignStages'+id).children.at(-1).children.length,5);
 const visible=f.api.visibleCampaignButtons(f.$('campaignMap')).map(b=>b.id);
 for(let n=(id===1?6:1);n<=(id===1?10:5);n++)assert(!visible.includes(n===1?'campaignPlay':'campaignPlay'+n));
 f.$('campaignBack').onclick();f.flush();assert.equal(f.$('campaignMap').dataset.campaign,'overview');
}
for(let i=0;i<10;i++)assert.equal(f.refs[i],f.$(i===0?'campaignPlay':'campaignPlay'+(i+1)),'Stage listener node preserved');
f.api.showCampaignStages(2);f.flush();f.$('campaignPlay10').onclick();assert.equal(f.document.lastStage,10);
assert.equal(JSON.stringify(progress),before,'Navigation does not write records');
f.api.showCampaignStages(99);assert.equal(f.$('campaignMap').dataset.campaign,'2');
f.api.setPlaying(true);f.api.openCampaignMap();f.flush();assert(f.api.state().paused);f.api.showCampaignStages(1);f.flush();f.api.showCampaignPicker();f.flush();assert(f.api.state().paused);f.api.closeCampaignMap();assert.equal(f.api.state().paused,false);assert.equal(f.api.visibleCampaignButtons(f.$('campaignMap')).length,0);
for(let n=1;n<=5;n++){progress.cleared[n]=true;progress.best[n]={stars:3}}
let d=f.api.campaignOverviewData(1);assert.equal(d.stars,15);assert.equal(d.cleared,5);assert.equal(d.next,null);assert.match(d.objective,/All stars earned/);
for(let n=6;n<=10;n++){progress.cleared[n]=true;progress.best[n]={stars:2}}
d=f.api.campaignOverviewData(2);assert.equal(d.stars,10);assert.equal(d.cleared,5);assert.equal(d.next,6);assert.match(d.objective,/Improve: Stage 06/);assert.equal(f.api.campaignOverviewData(1).stars,15);
assert(source.includes("const buttons=visibleCampaignButtons(map)"));assert(source.includes("map.dataset.campaign!=='overview')showCampaignPicker();else closeCampaignMap()"));
console.log('PASS campaign picker: two cards, five stages each, separate stars/objectives, stage access, hidden focus filtering, preserved listeners/scores, pause/resume and completion');
