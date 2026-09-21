/* Lesson captions follow the music clock, including pause, practice and rebound keys. */
(function(root){
 'use strict';
 function current(chart,time,keys){
  if(chart.source?.kind!=='tutorial'||!Array.isArray(chart.source.lessons))return null;
  const lessons=chart.source.lessons.filter(l=>l&&Number.isFinite(l.start)&&Number.isFinite(l.end)&&l.end>l.start&&Array.isArray(l.lines)).slice(0,100);
  const t=Math.max(0,time),index=lessons.findIndex(l=>t>=l.start&&t<l.end);
  if(index<0)return null;const l=lessons[index],replace=s=>String(s??'').slice(0,180).replaceAll('{upper}',keys[0]).replaceAll('{lower}',keys[1]);
  return {index,total:lessons.length,title:replace(l.title),lines:l.lines.slice(0,2).map(replace)};
 }
 function draw(g,lesson,pose){
  if(!lesson)return;g.save();const x=370,y=540,w=805,h=90;
  g.fillStyle='#271b42';g.beginPath();g.roundRect(x+4,y+5,w,h,12);g.fill();g.fillStyle='#fffceb';g.strokeStyle='#271b42';g.lineWidth=3;g.beginPath();g.roundRect(x,y,w,h,12);g.fill();g.stroke();
  function label(text,xx,yy,size,color,max){g.fillStyle=color;g.textAlign='left';g.font=`700 ${size}px "SevenCute","Microsoft YaHei",sans-serif`;while(g.measureText(text).width>max&&size>12){size--;g.font=`700 ${size}px "SevenCute","Microsoft YaHei",sans-serif`;}g.fillText(text,xx,yy);}
  label(lesson.title,x+16,y+25,20,'#833276',w-170);label(`${lesson.index+1} / ${lesson.total}`,x+w-72,y+24,15,'#74506c',60);
  lesson.lines.forEach((line,i)=>label(line,x+16,y+49+i*23,17,'#382848',w-32));
  if(pose){g.fillStyle=pose==='downslash'?'#37e1ec':'#ff83c0';g.beginPath();g.roundRect(48,600,282,35,8);g.fill();label(pose==='downslash'?'下劈 · 保持空中':'上撩 · 保持地面',62,623,18,'#271b42',250);}
  g.restore();
 }
 root.SevenLesson={current,draw};
 if(typeof module!=='undefined')module.exports=root.SevenLesson;
})(typeof window!=='undefined'?window:globalThis);
