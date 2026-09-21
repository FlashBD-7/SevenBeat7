/* Local canvas + game-audio recording. Always a real MP4 container, never a renamed WebM. */
(function(root){
 'use strict';
 class GameRecorder{
  constructor({onState=()=>{},onReady=()=>{},onError=()=>{}}={}){this.onState=onState;this.onReady=onReady;this.onError=onError;this.recorder=null;this.canvas=null;this.stream=null;this.chunks=[];this.bytes=0;this.elapsed=0;this.lastStart=0;this.result=null;this.options=null;this.state='idle';this.done=null;this.warmed=false;this.warmTimer=null;}
  static mime(){if(typeof MediaRecorder==='undefined')return null;return ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4;codecs=avc1,mp4a.40.2','video/mp4'].find(m=>MediaRecorder.isTypeSupported(m))||null;}
  get active(){return this.state==='preparing'||this.state==='recording';}
  get seconds(){return this.elapsed+(this.state==='recording'?(performance.now()-this.lastStart)/1000:0);}
  notify(){this.onState(this.state,this);}
  async start(audioStream,{includeUI=true,fps=30}={}){
   if(this.active||this.state==='stopping')throw new Error('请先结束当前录制。');
   const mime=GameRecorder.mime();if(!mime)throw new Error('当前浏览器不支持 MP4 录制，请使用支持 MP4 录制的新版 Edge / Chrome。');
   if(!HTMLCanvasElement.prototype.captureStream)throw new Error('当前浏览器不支持画面录制。');
   this.canvas=document.createElement('canvas');this.canvas.width=1280;this.canvas.height=720;
   this.options={includeUI:!!includeUI,fps:fps===60?60:30};this.chunks=[];this.bytes=0;this.elapsed=0;
   const video=this.canvas.captureStream(0),tracks=[...video.getVideoTracks(),...audioStream.getAudioTracks().map(t=>t.clone())];this.stream=new MediaStream(tracks);
   this.done=new Promise(resolve=>this.resolveDone=resolve);
   const createEncoder=()=>new MediaRecorder(this.stream,{mimeType:mime,videoBitsPerSecond:this.options.fps===60?9500000:6500000,audioBitsPerSecond:192000});
   // Some hardware encoders stall during their first few frames. Prime once before keeping a clip.
   if(!this.warmed){
    this.state='preparing';this.notify();
    try{
     const prepared=await new Promise((resolve,reject)=>{
      this.recorder=createEncoder();
      this.recorder.ondataavailable=()=>{};
      this.recorder.onerror=e=>{this.state='stopping';reject(new Error(e.error?.message||'编码器准备失败'));};
      this.recorder.onstop=()=>resolve(this.state==='preparing');
      this.recorder.start(500);
      this.warmTimer=setTimeout(()=>{if(this.recorder.state!=='inactive')this.recorder.stop();},2000);
     });
     clearTimeout(this.warmTimer);this.warmTimer=null;
     if(!prepared){this.cleanup();this.state='idle';this.notify();this.resolveDone?.(null);return false;}
     this.warmed=true;
    }catch(e){this.cleanup();this.state='idle';this.notify();this.resolveDone?.(null);throw new Error('MP4 编码器无法启动：'+e.message);}
   }
   try{this.recorder=createEncoder();}
   catch(e){this.cleanup();this.state='idle';this.notify();this.resolveDone?.(null);throw new Error('MP4 编码器无法启动：'+e.message);}
   this.recorder.ondataavailable=e=>{if(e.data.size){this.chunks.push(e.data);this.bytes+=e.data.size;if(this.bytes>700*1024*1024&&this.active){this.onError(new Error('本段录制已达到 700 MB，已停止并保留视频。'));this.stop();}}};
   this.recorder.onerror=e=>{this.onError(new Error('录制异常：'+(e.error?.message||'编码器错误')));this.stop();};
   this.recorder.onstop=()=>{const blob=new Blob(this.chunks,{type:this.recorder.mimeType||'video/mp4'});this.chunks=[];this.cleanup();this.state='idle';this.notify();if(blob.size>0){if(this.result?.url)URL.revokeObjectURL(this.result.url);this.result={blob,url:URL.createObjectURL(blob),seconds:this.elapsed,options:this.options,mime:blob.type};this.onReady(this.result);}else this.onError(new Error('没有生成有效的视频数据，请重试。'));this.resolveDone?.(this.result);};
   try{this.recorder.start(1000);}catch(e){this.cleanup();this.state='idle';this.resolveDone?.(null);throw new Error('无法开始录制：'+e.message);}
   this.state='recording';this.lastStart=performance.now();this.notify();return true;
  }
  paint(render){if(!this.active||!this.canvas)return;render(this.canvas.getContext('2d'),this.options.includeUI);this.stream?.getVideoTracks()[0]?.requestFrame();}
  stop(){if(!this.active)return this.done||Promise.resolve(this.result);if(this.state==='recording')this.elapsed+=(performance.now()-this.lastStart)/1000;this.state='stopping';this.notify();if(this.recorder.state!=='inactive')this.recorder.stop();return this.done;}
  cleanup(){clearTimeout(this.warmTimer);this.warmTimer=null;if(this.stream)for(const t of this.stream.getTracks())t.stop();this.stream=null;}
 }
 root.SevenRecorder=GameRecorder;
})(window);
