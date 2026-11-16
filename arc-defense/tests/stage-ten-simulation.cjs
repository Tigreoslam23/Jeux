// Runs the actual game loop without rendering. No browser or extra dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf("<script>(()=>{'use strict';")+8,end=source.indexOf("$('recommend').onclick=",start);
function game(){
 const nodes=new Map(),saved=new Map();
 const gradient={addColorStop(){}};
 const g=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||(()=>{})});
 function node(){return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){},contains(){return false}},getContext:()=>g,appendChild(){},append(){},replaceChildren(){},setAttribute(){},querySelector(){return this.id==='waveCountdownBanner'?node():null},querySelectorAll(){return []},addEventListener(){},focus(){},click(){}}}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)};
 for(const [id,value] of Object.entries({level:'2',seed:'20261104',speed:'4',analysisType:'precision',analysisLevel:'2'}))get(id).value=value;
 const c=vm.createContext({console,Math,Set,Map,Uint16Array,URLSearchParams,location:{search:''},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},document:{getElementById:get,createElement:node,querySelector:()=>node(),body:node(),addEventListener(){}},performance:{now:()=>1},window:{__arcLabManual:true,arcAudio:{mode(){},pause(){},effect(){}},matchMedia:()=>({matches:false})},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},arcWaveLocked:()=>false,towerPrices:{precision:80,rapid:90,pierce:125,elink:200,area:180,freeze:135,boom:175,grapple:155}});
 const exports=`
 draw=()=>{};
 const magnetStats={started:0,completed:0,cancelled:0,bossPairs:0,releases:[]};
 const originalMagnetStart=beginMagneticPair,originalMagnetEnd=endMagneticPair;
 beginMagneticPair=t=>{const ok=originalMagnetStart(t);if(ok){magnetStats.started++;const p=magneticPairs.at(-1);if(p.ids.some(id=>monsters.find(m=>m.id===id)?.boss))magnetStats.bossPairs++;}return ok};
 endMagneticPair=(p,complete=false)=>{complete?magnetStats.completed++:magnetStats.cancelled++;const before=p.ids.map(id=>monsters.find(m=>m.id===id)).filter(Boolean);originalMagnetEnd(p,complete);if(complete)magnetStats.releases.push(before.map(m=>({hp:m.hp,maxHp:m.maxHp,armor:m.armor})));};
 globalThis.sim={
 init:()=>{campaignStageNumber=10;campaignProgress.cleared['1']=true;campaignProgress.cleared['2']=true;campaignProgress.cleared['3']=true;campaignProgress.cleared['4']=true;campaignProgress.cleared['5']=true;campaignProgress.cleared['6']=true;campaignProgress.cleared['7']=true;campaignProgress.cleared['8']=true;campaignProgress.cleared['9']=true;for(const n of ['1', '2', '3', '4', '5', '6', '7', '8', '9'])campaignProgress.best[n]={stars:2,lives:18,kills:100,energy:100,level:2};unlockCampaignTechnologies(8);build();firstWaveStarted=true;launchWave(true)},
 state:()=>({magnetStats,protected:monsters.filter(isMagnetProtected).map(m=>({id:m.id,pair:m.magnetId,hp:m.hp,progress:m.progress,frozen:m.frozen,grapple:!!m.grapple})),endTitle:$('endTitle').textContent,titanRemainingHp,titanEncounter,titanPhaseReached,pendingEscorts:titanEscortQueue.length,waveTotal,boss:monsters.filter(m=>m.boss||m.miniBoss).map(m=>({twin:m.twin,hp:m.hp,progress:m.progress,phase:m.phase,guard:m.grappleGuard,captured:!!m.grapple})),wave:waveNumber,playing,lives,kills,energy,unlocked:[...campaignProgress.unlocked],defenses:towers.map(t=>({type:t.type,lv:t.lv})),done:campaignProgress.cleared['10']===true,progress:Math.max(0,...monsters.map(m=>m.progress)),length:way.at(-1).dist}),
 finishOtherStageLast:()=>{for(const n of ['6','7','9','10'])campaignProgress.cleared[n]=true;delete campaignProgress.cleared['8'];campaignStageNumber=8;lives=20;endStageOne(true);return $('endTitle').textContent},
 soloEnd:()=>{for(const n of ['6','7','8','9']){delete campaignProgress.cleared[n];delete campaignProgress.best[n]}lives=20;endStageOne(true);return $('endTitle').textContent},
 step:()=>animate((last||1)+50),
 best:(type,lv=1,from=0)=>{let best=null,score=-1;const samples=way.filter((p,i)=>i%3===0&&p.dist>=from);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!freeConstructionCell(x,y))continue;const cover=coverageMask(x,y,type,lv,samples).filter(Boolean).length;const spacing=towers.some(t=>Math.hypot(t.x-x,t.y-y)<1.8)?.6:1;if(cover*spacing>score){score=cover*spacing;best={x,y}}}return best},
 buy:(type,cell)=>{if(!technologyAvailable(type)||energy<towerPrices[type]||!cell||!freeConstructionCell(cell.x,cell.y))return false;const t={...cell,type,lv:1,cool:0,angle:0};if(type==='boom')t.boomAngle=fixedBoomAngle(t);towers.push(t);energy-=towerPrices[type];return true},
 upgrade:(type,max)=>{const t=towers.find(t=>t.type===type&&t.lv<max);if(!t)return false;const price=campaignUpgradeCost(t);if(energy<price)return false;energy-=price;t.lv++;return true},
 link:()=>{if(!technologyAvailable('elink')||energy<200)return false;let best=null,score=-1;const samples=way.filter((_,i)=>i%3===0);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!freeConstructionCell(x,y))continue;for(let yy=y;yy<H;yy++)for(let xx=0;xx<W;xx++){const a={x,y},b={x:xx,y:yy};if(!validELinkEnd(a,b))continue;const pa=ctr(a),pb=ctr(b);const n=samples.filter(p=>segmentClosest(pa,pb,p,p).dist<26).length;if(n>score){score=n;best={a,b}}}}if(!best)return false;towers.push({...best.a,end:best.b,type:'elink',lv:1,cool:0,angle:0});energy-=200;return true}
 };
 })();`;
 vm.runInContext(source.slice(start,end)+exports,c,{timeout:10000});return {sim:c.sim,saved};
}
const {sim,saved}=game();sim.init();let state=sim.state();assert.equal(state.energy,800);
sim.buy('precision',sim.best('precision',2));sim.buy('rapid',sim.best('rapid',2));sim.link();
let lastWave=0,sawFinalPhase2=false,sawPhase2=false,priorProtected=new Map();
for(let i=0;i<50000;i++){
 state=sim.state();for(const m of state.protected){const old=priorProtected.get(m.id);if(old&&old.pair===m.pair){assert.equal(m.hp,old.hp);assert(m.progress>=old.progress);assert(!m.frozen&&!m.grapple)}}priorProtected=new Map(state.protected.map(m=>[m.id,m]));
 sawPhase2 ||= state.titanPhaseReached===2;sawFinalPhase2 ||= state.boss.some(m=>m.phase===2);
 if(state.lives<=0||state.done)break;
 if(state.boss.length){if(state.defenses.filter(t=>t.type==='precision').length<2)sim.buy('precision',sim.best('precision',3,state.length*.76));for(const [type,level] of [['area',5],['precision',4],['boom',5],['precision',5],['elink',5]])while(sim.upgrade(type,level)){} }
 if(state.wave!==lastWave){
  lastWave=state.wave;
  if(!state.defenses.some(t=>t.type==='freeze'))sim.buy('freeze',sim.best('freeze',2));
  if(!state.defenses.some(t=>t.type==='area'))sim.buy('area',sim.best('area',2));
  if(state.wave>=3&&!state.defenses.some(t=>t.type==='grapple'))sim.buy('grapple',sim.best('grapple',2));
  if(state.wave>=4&&!state.defenses.some(t=>t.type==='boom'))sim.buy('boom',sim.best('boom',3));
  if(state.wave>=7&&state.defenses.filter(t=>t.type==='rapid').length<2)sim.buy('rapid',sim.best('rapid',3));
  if(state.wave>=9&&state.defenses.filter(t=>t.type==='elink').length<2)sim.link();
  if(state.wave>=10&&state.defenses.filter(t=>t.type==='freeze').length<2)sim.buy('freeze',sim.best('freeze',3));
  if(state.wave>=12&&state.defenses.filter(t=>t.type==='area').length<2)sim.buy('area',sim.best('area',3));
  for(const [type,level] of [['precision',3],['area',2],['freeze',2],['rapid',3],['grapple',2],['elink',2],['area',3],['precision',4],['freeze',3],['grapple',3],['elink',3],['area',4],['rapid',4],['precision',5],['freeze',4],['grapple',4],['rapid',5],['boom',4],['grapple',5],['elink',4],['area',5],['boom',5],['freeze',5],['elink',5]])while(sim.upgrade(type,level)){}
  console.log('Wave',state.wave,'core',state.lives,'energy',sim.state().energy);
 }
 sim.step();
}
state=sim.state();console.log(JSON.stringify({...state,magnetStats:{started:state.magnetStats.started,completed:state.magnetStats.completed,cancelled:state.magnetStats.cancelled,bossPairs:state.magnetStats.bossPairs}}));
assert(state.done,'A legal defense completes Stage 10');assert(sawFinalPhase2,'Final boss phase II is exercised');assert.equal(state.endTitle,'CAMPAIGN 02 COMPLETE');assert.equal(state.kills+20-state.lives,729);assert.equal(state.titanEncounter,'defeated');assert.equal(state.pendingEscorts,0);assert(state.magnetStats.bossPairs>0);
const progress=JSON.parse(saved.get('arc_campaign_v1'));assert(progress.cleared['10']);assert.equal(progress.best['5'].lives,18);assert.equal(progress.best['6'].lives,18);assert(progress.best['10']);console.log('PASS real Stage 10 loop and isolated records');

const solo=game();solo.sim.init();assert.equal(solo.sim.soloEnd(),'STAGE 10 COMPLETE','Winning only the open finale must not claim all five stages cleared');

const other=game();other.sim.init();assert.equal(other.sim.finishOtherStageLast(),'CAMPAIGN 02 COMPLETE','The last missing stage also completes Rupture when played out of order');
