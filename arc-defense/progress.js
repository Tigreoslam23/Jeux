(function(root){
 'use strict';
 const types=['pusher','maw','precision','rapid','pierce','freeze','area','elink','boom','grapple'];
 const keys=['arc_campaign_v1','arc_defense_v1_best',...Array.from({length:10},(_,i)=>'arc_free_v1_'+(i+1)),'arcAudioV912','arc_arena_theme','arc-graphics-quality'];
 const integer=(v,min=0,max=10000000)=>Number.isInteger(v)&&v>=min&&v<=max;
 const plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 function valid(key,v){
  if(key==='arc_campaign_v1')return plain(v)&&v.version===1&&Array.isArray(v.unlocked)&&v.unlocked.every(t=>types.includes(t))&&plain(v.cleared)&&plain(v.best)&&Object.entries(v.cleared).every(([id,b])=>integer(+id,1,10)&&b===true)&&Object.entries(v.best).every(([id,b])=>integer(+id,1,10)&&plain(b)&&integer(b.stars,1,3)&&integer(b.lives,1,20)&&integer(b.kills)&&integer(b.energy)&&integer(b.level,1,3));
  if(key.startsWith('arc_free_v1_'))return plain(v)&&typeof v.won==='boolean'&&integer(v.kills)&&integer(v.lives,0,20)&&integer(v.count,1,100000)&&v.kills<=v.count;
  if(key==='arc_defense_v1_best')return plain(v)&&typeof v.won==='boolean'&&integer(v.wave,1,20)&&integer(v.lives,0,20)&&integer(v.kills)&&integer(v.energy)&&integer(+v.level,1,3);
  if(key==='arcAudioV912')return plain(v)&&typeof v.enabled==='boolean'&&Number.isFinite(v.music)&&v.music>=0&&v.music<=1&&Number.isFinite(v.fx)&&v.fx>=0&&v.fx<=1;
  if(key==='arc_arena_theme')return ['contact','rupture'].includes(v);
  if(key==='arc-graphics-quality')return ['eco','normal','high'].includes(v);
  return false;
 }
 function read(storage){const data={};for(const key of keys){try{const raw=storage.getItem(key);if(raw===null)continue;const value=['arc_arena_theme','arc-graphics-quality'].includes(key)?raw:JSON.parse(raw);if(valid(key,value))data[key]=value}catch(e){}}return data}
 function parse(text){if(typeof text!=='string'||text.length>524288)throw Error('Backup exceeds 512 KB.');let file;try{file=JSON.parse(text)}catch(e){throw Error('This is not a valid JSON backup.')}
  if(!plain(file)||file.app!=='arc-defense'||file.schema!==1||!plain(file.data))throw Error('Choose an ARC DEFENSE backup.');
  const data={};for(const [key,value] of Object.entries(file.data)){if(!keys.includes(key)||!valid(key,value))throw Error('The backup contains invalid progress.');data[key]=value}if(!Object.keys(data).length)throw Error('The backup contains no progress.');return data;
 }
 function better(a,b,fields){if(!a)return b;for(const field of fields){const x=Number(a[field]),y=Number(b[field]);if(x!==y)return y>x?b:a}return a}
 function merge(current,incoming){const data={...current};for(const [key,value] of Object.entries(incoming)){
  const old=current[key];if(key==='arc_campaign_v1'&&old){const best={...old.best};for(const [id,b] of Object.entries(value.best))best[id]=better(best[id],b,['stars','lives','level','kills']);data[key]={version:1,unlocked:[...new Set([...old.unlocked,...value.unlocked])],cleared:{...old.cleared,...value.cleared},best}}
  else if(key.startsWith('arc_free_v1_'))data[key]=better(old,value,['won','kills','lives']);
  else if(key==='arc_defense_v1_best')data[key]=better(old,value,['won','wave','lives','kills']);else data[key]=value;
 }return data}
 function write(storage,data){const previous={};for(const key of Object.keys(data)){if(!keys.includes(key)||!valid(key,data[key]))throw Error('Invalid progress');previous[key]=storage.getItem(key)}
  try{for(const [key,value] of Object.entries(data))storage.setItem(key,['arc_arena_theme','arc-graphics-quality'].includes(key)?value:JSON.stringify(value))}
  catch(e){for(const [key,value] of Object.entries(previous)){try{if(value===null)storage.removeItem(key);else storage.setItem(key,value)}catch(ignored){}}throw Error('Progress could not be saved. Existing data was restored where possible.')}
 }
 const api={keys,valid,read,parse,merge,write,export:storage=>JSON.stringify({app:'arc-defense',schema:1,createdAt:new Date().toISOString(),data:read(storage)},null,2)};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.ArcProgress=api;
})(typeof window==='object'?window:globalThis);
