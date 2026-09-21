/* Menu-only audio stays outside the game/recording mix. Browser autoplay rules are respected. */
(function(root){'use strict';
 class MenuMusic{
  constructor(tracks,onState=()=>{}){this.tracks=tracks;this.onState=onState;this.audio=new Audio();this.audio.loop=true;this.audio.preload='metadata';this.key=null;this.allowed=false;this.enabled=true;this.blocked=false;this.busy=false;this.token=0;this.failed=false;this.audio.onplaying=()=>this.onState();this.audio.onpause=()=>this.onState();this.audio.onerror=()=>{this.failed=true;this.onState();};}
  get playing(){return !this.audio.paused&&!this.audio.ended;}
  configure({key='sympathy',volume=35,enabled=true,allowed=false}){const next=this.tracks[key]?key:'sympathy';this.enabled=enabled;this.allowed=allowed;this.audio.volume=Math.max(0,Math.min(1,volume/100));if(next!==this.key){this.stop();this.key=next;this.audio.src=this.tracks[next].audio;this.blocked=false;this.failed=false;}if(!enabled||!allowed)this.stop();else this.play();}
  async play(){if(!this.enabled||!this.allowed||this.playing||this.busy||this.blocked||this.failed)return;const token=++this.token;this.busy=true;try{await this.audio.play();if(token===this.token&&(!this.allowed||!this.enabled))this.audio.pause();}catch(e){if(token===this.token){if(e.name==='NotAllowedError')this.blocked=true;else if(e.name!=='AbortError')this.failed=true;}}finally{if(token===this.token)this.busy=false;this.onState();}}
  unlock(){if(!this.allowed||!this.enabled)return;this.blocked=false;this.play();}
  stop(){if(this.playing||this.busy){this.token++;this.busy=false;this.audio.pause();}this.onState();}
 }
 root.SevenMenuMusic=MenuMusic;
})(typeof window!=='undefined'?window:globalThis);
