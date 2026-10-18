// Audio starts only after a gesture. Missing audio never blocks the game.
export class GameAudio {
 constructor(){this.enabled=true;this.ctx=null;this.buffers={};this.loading=null;}
 async start(){
  if(!this.enabled)return;
  try{
   if(!this.ctx){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=.5;this.master.connect(this.ctx.destination);}
   await this.ctx.resume();
   if(!this.loading)this.loading=Promise.all(['rain','correct','wrong','finish','birds','traffic'].map(async name=>{try{const r=await fetch(`assets/audio/${name}.wav`);if(!r.ok)return;this.buffers[name]=await this.ctx.decodeAudioData(await r.arrayBuffer());}catch{}})).then(()=>{
    for(const [name,volume] of [['rain',.3],['traffic',.018]]){if(!this.buffers[name])continue;const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=this.buffers[name];s.loop=true;g.gain.value=volume;s.connect(g).connect(this.master);s.start();if(name==='rain')this.rainGain=g;}
   });
   await this.loading;
  }catch{}
 }
 setEnabled(on){this.enabled=on;if(this.master)this.master.gain.setTargetAtTime(on?.5:0,this.ctx.currentTime,.15);if(on)this.start();}
 setRain(value){if(this.rainGain)this.rainGain.gain.setTargetAtTime(value*value*.34,this.ctx.currentTime,.3);}
 play(name){if(!this.enabled||!this.ctx||!this.buffers[name])return;const s=this.ctx.createBufferSource();s.buffer=this.buffers[name];s.connect(this.master);s.start();}
 suspend(){if(this.ctx)this.ctx.suspend().catch(()=>{});}
 resume(){if(this.enabled&&this.ctx)this.ctx.resume().catch(()=>{});}
}
