import {setCanvasResolution} from './resolution.js';
import {rounds,shuffle,selectWord} from './rounds.js';
import {createScene} from './scene.js?v=12';

const game=document.getElementById('game'),canvas=document.getElementById('city'),words=document.getElementById('words'),title=document.getElementById('task'),count=document.getElementById('count'),feedback=document.getElementById('feedback'),next=document.getElementById('next'),nextWrap=next.parentElement;
let roundIndex=0,found=new Set(),scene=null,started=false,ready=false,announced=false,last=0;
function fit(){const scale=Math.min(innerWidth/1280,innerHeight/720);game.style.transform=`translate(-50%,-50%) scale(${scale})`;document.body.style.width='100%';document.body.style.height='100svh';setCanvasResolution(canvas,1280,526,scale,devicePixelRatio||1);}
addEventListener('resize',fit);fit();
document.addEventListener('visibilitychange',()=>{last=0;});
const rules=document.getElementById('rules'),startButton=document.getElementById('start-game');
startButton.focus({preventScroll:true});
rules.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();startButton.focus();}});
startButton.onclick=()=>{
 started=true;last=0;rules.hidden=true;
 game.querySelectorAll('section').forEach(section=>section.inert=false);
 words.querySelectorAll('button').forEach(button=>button.disabled=!ready||!started);
 if(ready)words.querySelector('button')?.focus({preventScroll:true});
};
function arrange(list){
 // Balance total letter widths between rows, without making a rigid grid.
 const rows=[[],[]],lengths=[0,0];
 for(const word of [...list].sort((a,b)=>b.length-a.length)){let k=lengths[0]<=lengths[1]?0:1;if(rows[k].length===6)k=1-k;rows[k].push(word);lengths[k]+=word.length;}
 return rows.map(row=>shuffle(row));
}
function startRound(){
 found=new Set();announced=false;nextWrap.hidden=true;next.disabled=true;words.replaceChildren();feedback.textContent='';
 const round=rounds[roundIndex];title.textContent=round.title;count.textContent='Найдено 0 из 5';canvas.setAttribute('aria-label','Дождливый город. '+round.title.toLowerCase()+'.');
 for(const row of arrange(shuffle([...round.answers,...round.distractors]))){const group=document.createElement('div');group.className='word-row';for(const word of row){const button=document.createElement('button');button.className='word';button.type='button';button.textContent=word;button.setAttribute('aria-pressed','false');button.disabled=!ready||!started;button.addEventListener('click',()=>choose(word,button));button.addEventListener('animationend',()=>button.classList.remove('wrong'));group.append(button);}words.append(group);}
 scene?.reset(roundIndex);
}
function choose(word,button){
 if(!ready||!started||found.size===5)return;
 const result=selectWord(rounds[roundIndex],found,word);
 if(result==='duplicate')return;
 if(result==='wrong'){button.classList.remove('wrong');void button.offsetWidth;button.classList.add('wrong');feedback.textContent='Попробуй другое слово.';return;}
 button.setAttribute('aria-pressed','true');count.textContent=`Найдено ${found.size} из 5`;feedback.textContent=`Верно: ${word.toLowerCase()}.`;scene.progress(found.size,5);
}
next.onclick=()=>{if(next.disabled)return;roundIndex=(roundIndex+1)%rounds.length;startRound();words.querySelector('button')?.focus({preventScroll:true});};
const assets={city:'city-original.png',clouds:'clouds-original.png',car:'car-original.png',taxi:'taxi-original.png',bus:'bus-original.png',heroParts:'heroes-v2.png',heroHood:'heroes-hood-v2.png',hoodOnly:'hood-fabric.png'};
async function loadImages(){const entries=await Promise.all(Object.entries(assets).map(([name,file])=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve([name,image]);image.onerror=()=>reject(new Error(file));image.src=`assets/images/${file}`;})));return Object.fromEntries(entries);}
startRound();
loadImages().then(images=>{scene=createScene(canvas,images);ready=true;words.querySelectorAll('button').forEach(b=>b.disabled=!started);requestAnimationFrame(tick);}).catch(()=>{document.getElementById('error').hidden=false;});
function tick(time){const scale=Math.min(innerWidth/1280,innerHeight/720);setCanvasResolution(canvas,1280,526,scale,devicePixelRatio||1);const dt=last?Math.min(.04,(time-last)/1000):0;last=time;if(!document.hidden){scene.draw(started?dt:0);if(scene.finished&&!announced){announced=true;const done=roundIndex===rounds.length-1;next.textContent=done?'ИГРАТЬ СНОВА':'ДАЛЬШЕ →';next.disabled=false;nextWrap.hidden=false;feedback.textContent=done?'Все задания выполнены! Солнце вернулось в город.':'Все слова найдены. Дождь закончился.';canvas.setAttribute('aria-label','Солнечный город после дождя. Жители улыбаются.');}}requestAnimationFrame(tick);}
