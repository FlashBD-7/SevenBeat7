/* SevenBeat timing rules. No rendering or audio dependency. */
(function(root){
  'use strict';
  const WINDOWS={perfect:.070,good:.150};
  function validateChart(value){
    if(!value||!Array.isArray(value.notes))throw new Error('谱面必须包含 notes 数组。');
    if(value.notes.length>50000)throw new Error('谱面最多支持 50000 个音符。');
    const num=(x,fallback)=>Number.isFinite(Number(x))?Number(x):fallback;
    const ids=new Set();
    const notes=value.notes.map((n,i)=>{
      if(!n||!Number.isFinite(n.time)||n.time<0||n.time>14400||![0,1].includes(n.lane)||!['tap','hold','dodge'].includes(n.type))throw new Error(`第 ${i+1} 个音符的时间、轨道或类型无效。`);
      const dodge=n.type==='dodge'||n.skin==='obstacle',type=dodge?'dodge':n.type;
      let duration=type==='hold'?Number(n.duration):0;
      if(type==='hold'&&(!Number.isFinite(duration)||duration<.08||duration>600))throw new Error(`第 ${i+1} 个长按时长无效（0.08–600 秒）。`);
      let id=String(n.id||`note-${i}`);if(ids.has(id))id+=`-${i}`;ids.add(id);
      return {id,time:n.time,lane:dodge?1:n.lane,type,duration,skin:dodge?'obstacle':['monster','bat','bunny','star','cat','ufo','slime','upper','lower'].includes(n.skin)?n.skin:'monster',color:['cyan','pink','mint','purple','yellow','orange','lane'].includes(n.color)?n.color:'lane'};
    }).sort((a,b)=>a.time-b.time||a.lane-b.lane);
    const previous=[null,null];
    let lastGear=-Infinity;
    for(const n of notes){if(n.type==='dodge'){if(n.time-lastGear<.001)throw new Error('同一时刻只能放置一个齿轮。');lastGear=n.time;continue;}const p=previous[n.lane];if(p&&n.time<p.time+p.duration-.001)throw new Error(`轨道 ${n.lane+1} 在 ${n.time.toFixed(3)} 秒有重叠音符，请先移开它们。`);if(p&&Math.abs(n.time-p.time)<.001)throw new Error('同一轨道不能有同时刻音符。');previous[n.lane]=n;}
    // Ground hits can coincide with gears: hold air first, then downslash without landing.
    return {version:1,title:String(value.title||'未命名谱面').slice(0,100),artist:String(value.artist||'我的创作').slice(0,100),bpm:Math.max(20,Math.min(400,num(value.bpm,120))),offset:Math.max(-30,Math.min(30,num(value.offset,0))),audio:String(value.audio||''),duration:Math.max(0,num(value.duration,0)),source:value.source||null,notes};
  }
  class Engine{
    constructor(chart,onJudge=()=>{}){this.chart=validateChart(chart);this.notes=this.chart.notes.map(n=>({...n,state:'pending',grade:null}));this.onJudge=onJudge;this.score=0;this.combo=0;this.maxCombo=0;this.counts={PERFECT:0,GOOD:0,MISS:0};this.held=[false,false];this.auto=false;this.airborne=false;this.airUntil=-Infinity;this.dodged=0;}
    get accuracy(){const c=this.counts,n=c.PERFECT+c.GOOD+c.MISS;return n?(c.PERFECT+c.GOOD*.6)/n*100:100;}
    finish(n,grade,error=0){if(n.state==='done')return;n.state='done';n.grade=grade;this.counts[grade]++;if(grade==='MISS')this.combo=0;else{this.combo++;this.score+=grade==='PERFECT'?1000:600;this.maxCombo=Math.max(this.maxCombo,this.combo);}this.onJudge({note:n,grade,error});}
    setAirborne(value,t,until=Infinity){this.update(t-1e-7);this.airborne=!!value;this.airUntil=value?until:-Infinity;this.update(t);}
    press(lane,t){if(this.held[lane])return;this.held[lane]=true;this.update(t);let n=null;for(const candidate of this.notes){if(candidate.time>t+WINDOWS.good+1e-8)break;if(candidate.type==='dodge'||candidate.lane!==lane||candidate.state!=='pending')continue;const error=Math.abs(t-candidate.time);if(error<=WINDOWS.good+1e-8&&(!n||error<Math.abs(t-n.time)-1e-8))n=candidate;}if(!n)return;const error=t-n.time;const grade=Math.abs(error)<=WINDOWS.perfect+1e-8?'PERFECT':'GOOD';if(n.type==='hold'){n.state='holding';n.headGrade=grade;n.error=error;this.onJudge({note:n,grade:'HOLD',error});}else this.finish(n,grade,error);}
    release(lane,t){this.update(t);this.held[lane]=false;for(const n of this.notes){if(n.lane!==lane||n.state!=='holding')continue;const early=n.time+n.duration-t;if(early>WINDOWS.good+1e-8)this.finish(n,'MISS',-early);else this.finish(n,early>WINDOWS.perfect+1e-8?'GOOD':n.headGrade,-Math.max(early,0));}}
    update(t){for(const n of this.notes){if(n.time>t+.22)break;if(n.state==='done')continue;if(n.type==='dodge'){if(this.auto&&!n.cued&&t>=n.time-.20){n.cued=true;this.onJudge({note:n,grade:'DODGE_READY',error:0});}if(t>=n.time){const safe=this.auto||(this.airborne&&n.time<=this.airUntil);if(safe)this.dodged++;this.finish(n,safe?'PERFECT':'MISS',0);}continue;}if(this.auto&&t>=n.time){if(n.type==='tap'){this.finish(n,'PERFECT');continue;}if(n.state==='pending'){n.state='holding';n.headGrade='PERFECT';this.onJudge({note:n,grade:'HOLD',error:0});}}
      if(n.state==='holding'&&t>=n.time+n.duration)this.finish(n,n.headGrade,n.error||0);else if(n.state==='pending'&&t-n.time>WINDOWS.good+1e-8)this.finish(n,'MISS',t-n.time);}}
    seekPractice(t){for(const n of this.notes)if(n.time+n.duration<t)n.state='done';}
  }
  root.SevenBeatCore={Engine,validateChart,WINDOWS};
  if(typeof module!=='undefined')module.exports=root.SevenBeatCore;
})(typeof window!=='undefined'?window:globalThis);
