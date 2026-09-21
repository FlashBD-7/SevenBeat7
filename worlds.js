/* Original, endlessly scrolling vector scenes and deterministic ambient particles. */
(function(root){
 'use strict';
 const themes={
  campus:{name:'春日白天校园',caption:'SAKURA SCHOOL DAY',particle:'petals',sky:['#96d4ec','#fbe7df'],ground:['#dfc5c1','#c1a7b0'],accent:'#4c7185'},
  maple:{name:'秋天枫叶小径',caption:'MAPLE AFTERNOON',particle:'leaves',sky:['#f5bf8f','#ffeacb'],ground:['#c69676','#855e66'],accent:'#734856'},
  snow:{name:'冬日落雪街角',caption:'SNOWY LITTLE TOWN',particle:'snow',sky:['#99bddc','#e3edf3'],ground:['#eef3f6','#bbcddd'],accent:'#536b91'},
  sea:{name:'夏日晴空海滨',caption:'SUMMER BY THE SEA',particle:'dust',sky:['#85cfe8','#e1f6f5'],ground:['#f4ddac','#c7b799'],accent:'#357a94'},
  night:{name:'霓虹暮色',caption:'NEON AFTERGLOW',particle:'fireflies',sky:['#24223e','#766091'],ground:['#292c47','#171f32'],accent:'#c1b5ed'},
  dawn:{name:'樱色清晨',caption:'PINK DAYBREAK',particle:'petals',sky:['#8e81b0','#f4c3d0'],ground:['#9082a5','#655a85'],accent:'#fce2ed'}
 };
 const mod=(n,m)=>(n%m+m)%m,seed=n=>mod(Math.sin(n*127.1+43.7)*43758.5453,1);
 function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 function box(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
 function line(c,points,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 function gradient(c,y1,y2,a,b){const grad=c.createLinearGradient(0,y1,0,y2);grad.addColorStop(0,a);grad.addColorStop(1,b);return grad;}
 function cloud(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);oval(c,0,0,64,15,'#fffdf5b0');oval(c,-24,-9,24,21,'#fffdf5b0');oval(c,17,-16,34,28,'#fffdf5b0');c.restore();}
 function hills(c,t,colors){colors.forEach((color,layer)=>{c.fillStyle=color;c.beginPath();c.moveTo(0,555);for(let x=0;x<=1290;x+=15)c.lineTo(x,380+layer*40+Math.sin((x+t*(8+layer*7))/185+layer)*27+Math.sin((x+t*12)/75)*7);c.lineTo(1290,600);c.closePath();c.fill();});}
 function fence(c,t,y,color){const off=mod(t*100,70);for(let i=-1;i<20;i++)box(c,i*70-off,y,7,70,3,color);box(c,0,y+12,1280,6,2,color);box(c,0,y+41,1280,5,2,color);}
 function tree(c,x,y,s,kind){c.save();c.translate(x,y);c.scale(s,s);const autumn=kind==='maple',snow=kind==='snow';const trunk=autumn?'#986250':'#998185';line(c,[[0,0],[-5,-95],[8,-167]],trunk,15);line(c,[[-4,-87],[-48,-123]],trunk,9);line(c,[[0,-106],[42,-141]],trunk,8);
 if(snow){for(let k=0;k<3;k++){c.fillStyle=['#668e9c','#7fa7b5','#aac4ce'][k];c.beginPath();c.moveTo(0,-226+k*39);c.lineTo(-69+k*9,-124+k*32);c.lineTo(67-k*9,-124+k*32);c.closePath();c.fill();line(c,[[-52+k*8,-138+k*32],[0,-212+k*39],[51-k*8,-138+k*32]],'#eef5f5',9);}}
 else{const cols=autumn?['#c86950','#e88353','#eea259','#f1b774']:['#e7a6bd','#f5b7cc','#ffd1de','#ffe0e9'];for(let j=0;j<10;j++){const angle=j*2.4,xx=Math.cos(angle)*54,yy=-170+Math.sin(angle)*37;oval(c,xx,yy,44+(j%3)*6,33+(j%2)*5,cols[j%4]);}oval(c,-8,-204,39,25,autumn?'#ffd191':'#fff0ef');}
 c.restore();}
 function campus(c,t){
 hills(c,t,['#a8cbb8','#bbd5b9','#c5d7b9']);
 // Repeating school buildings sit on a slower plane than the cherry trees.
 for(let i=-1;i<3;i++){const x=i*860-mod(t*24,860);box(c,x+105,213,570,271,6,'#ede2d2');box(c,x+90,203,600,18,4,'#b78985');box(c,x+105,248,570,9,1,'#d7bda9');box(c,x+317,157,149,327,7,'#fbf0dc');c.fillStyle='#c19399';c.beginPath();c.moveTo(x+300,172);c.lineTo(x+391,117);c.lineTo(x+482,172);c.fill();oval(c,x+391,190,27,27,'#e2c9b2');oval(c,x+391,190,22,22,'#fff6de');line(c,[[x+391,174],[x+391,190],[x+403,196]],'#917d83',3);
 for(let row=0;row<3;row++)for(let col=0;col<8;col++){const wx=x+128+col*65;if(col===3||col===4)continue;box(c,wx,273+row*60,42,38,4,'#94bdce');box(c,wx+3,276+row*60,36,8,2,'#c3e0e8');line(c,[[wx+21,277+row*60],[wx+21,307+row*60]],'#efe7d9',2);}
 box(c,x+353,368,78,116,6,'#869eab');box(c,x+365,382,54,86,2,'#afced5');line(c,[[x+391,382],[x+391,468]],'#eef5ee',3);box(c,x+296,481,191,14,3,'#c3b1a5');line(c,[[x+699,164],[x+699,458]],'#b1bec0',5);c.fillStyle='#f2a5bb';c.beginPath();c.moveTo(x+699,166);c.quadraticCurveTo(x+733,151,x+754,169);c.lineTo(x+754,211);c.quadraticCurveTo(x+730,190,x+699,208);c.fill();}
 for(let i=-1;i<6;i++)tree(c,i*315-mod(t*66,315),544,.91+(i%2)*.08,'campus');
 fence(c,t,490,'#f0eee2');for(let i=-1;i<8;i++){const x=i*198-mod(t*120,198);oval(c,x,555,65,17,'#9db69b');for(let j=0;j<7;j++)oval(c,x-43+j*14,548+(j%2)*5,4,4,j%2?'#fff4d1':'#e39fb8');}
 }
 function maple(c,t){hills(c,t,['#c8b189','#ddbe8c','#e6ca99']);for(let i=-1;i<7;i++)tree(c,i*243-mod(t*32,243),505,.79,'maple');
 for(let i=-1;i<5;i++){const x=i*430-mod(t*89,430);tree(c,x+20,557,1.25,'maple');line(c,[[x+252,548],[x+252,287],[x+289,287]],'#795766',8);box(c,x+270,271,38,49,8,'#8c6870');box(c,x+277,280,24,30,4,'#ffe4a3');oval(c,x+288,296,39,49,'#ffdd7a13');box(c,x+141,485,100,12,4,'#a27a67');box(c,x+146,451,91,11,3,'#b08a6e');box(c,x+146,468,91,9,3,'#b08a6e');line(c,[[x+156,463],[x+151,544]],'#705868',6);line(c,[[x+225,463],[x+230,544]],'#705868',6);}
 }
 function snow(c,t){hills(c,t,['#b7cfdf','#d2e2ed','#e8f1f3']);for(let i=-1;i<6;i++){const x=i*290-mod(t*34,290);box(c,x+17,330,199,179,9,i%2?'#a3b6cf':'#b5adbf');c.fillStyle='#eaf4f6';c.beginPath();c.moveTo(x,342);c.lineTo(x+116,256);c.lineTo(x+234,342);c.fill();for(let j=0;j<3;j++){box(c,x+44+j*53,374,32,42,4,'#ffe0a7');box(c,x+44+j*53,438,32,40,3,'#d8e6ee');}box(c,x+91,304,53,14,4,'#fffdf9');}
 for(let i=-1;i<6;i++)tree(c,i*315-mod(t*78,315),548,.95,'snow');
 for(let i=-1;i<3;i++){const x=i*740-mod(t*112,740);oval(c,x+475,548,57,13,'#ffffff');oval(c,x+475,505,29,35,'#f9fcff');oval(c,x+475,460,22,24,'#fffefa');box(c,x+453,437,42,8,2,'#586b8a');box(c,x+459,414,28,28,4,'#667998');box(c,x+451,481,46,9,4,'#cf8d9e');box(c,x+482,487,11,28,3,'#cf8d9e');oval(c,x+468,457,2.5,2.5,'#66738a');oval(c,x+482,457,2.5,2.5,'#66738a');line(c,[[x+453,503],[x+429,488]],'#9ba6b3',4);line(c,[[x+502,504],[x+526,488]],'#9ba6b3',4);c.fillStyle='#eba17c';c.beginPath();c.moveTo(x+475,463);c.lineTo(x+490,466);c.lineTo(x+475,470);c.fill();}
 }
 function sea(c,t){c.fillStyle=gradient(c,330,555,'#73c4d4','#bce2db');c.fillRect(0,330,1280,230);for(let row=0;row<5;row++){c.strokeStyle=row%2?'#e5fcf275':'#f5fffbb0';c.lineWidth=2;c.beginPath();for(let x=0;x<=1300;x+=10){const y=361+row*43+Math.sin((x+t*42+row*20)/40)*3; x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 for(let i=-1;i<3;i++){const x=i*650-mod(t*25,650);c.fillStyle='#f8eee1';c.beginPath();c.moveTo(x+210,320);c.lineTo(x+251,271);c.lineTo(x+251,320);c.fill();line(c,[[x+251,267],[x+251,340]],'#938c9c',3);c.fillStyle='#ae92a3';c.beginPath();c.moveTo(x+222,330);c.lineTo(x+285,330);c.lineTo(x+271,343);c.lineTo(x+235,343);c.fill();}
 fence(c,t,469,'#f9f3df');for(let i=-1;i<4;i++){const x=i*490-mod(t*91,490);line(c,[[x+110,540],[x+109,346]],'#d4b58f',5);c.fillStyle=i%2?'#f5b6b6':'#a7d6c6';c.beginPath();c.moveTo(x+32,362);c.quadraticCurveTo(x+111,259,x+190,362);c.fill();line(c,[[x+32,362],[x+190,362]],'#f9efdc',4);box(c,x+244,505,114,16,4,'#eac7aa');line(c,[[x+254,515],[x+242,544]],'#baa295',5);line(c,[[x+345,515],[x+357,544]],'#baa295',5);}
 for(let i=0;i<5;i++){const x=mod(i*281-t*17,1370)-50,y=149+Math.sin(i*2+t*.2)*37;line(c,[[x-10,y],[x,y+5],[x+10,y]],'#fffef6',3);}
 }
 function city(c,t,night){hills(c,t,night?['#49436a','#625477','#7b688a']:['#a191ba','#b9a0c4','#d0b4cd']);for(let i=-1;i<10;i++){const x=i*195-mod(t*38,195),h=130+mod(i,3)*55;box(c,x,515-h,48,h,2,night?'#353551':'#8b80a5');box(c,x+40,540-h,35,h-25,2,night?'#3e3f60':'#a397b6');for(let j=0;j<3;j++)box(c,x+12,530-h+j*40,7,16,3,j%2?'#bed6c185':'#e7bde77a');}for(let i=-1;i<6;i++){const x=i*340-mod(t*80,340);line(c,[[x,570],[x,270],[x+44,244]],night?'#9981a4':'#d3b5c7',9);oval(c,x+44,244,15,9,'#f2d4bc');oval(c,x+44,244,39,27,'#efd2bc16');}}
 function draw(c,t,key='campus',custom=null,customScale=1){const theme=themes[key]||themes.campus;c.save();c.fillStyle=gradient(c,0,570,...theme.sky);c.fillRect(0,0,1280,720);
 if(custom){const ih=720*customScale,iw=ih*custom.width/custom.height;for(let x=-mod(t*35,iw);x<1280;x+=iw)c.drawImage(custom,x,(720-ih)/2,iw,ih);c.fillStyle='#17192b12';c.fillRect(0,0,1280,720);}
 else{
  if(key==='night'){oval(c,1040,133,64,64,'#f4e6d1');oval(c,1019,116,62,62,theme.sky[0]);for(let i=0;i<40;i++)oval(c,seed(i)*1280,45+seed(i+40)*270,1.4,1.4,'#fff9d7aa');}
  else{oval(c,1033,107,41,41,'#ffefd0');oval(c,1033,107,58,58,'#fff7da29');for(let i=-1;i<5;i++)cloud(c,i*378-mod(t*9,378),91+mod(i,3)*48,.65+mod(i,2)*.28);}
  ({campus,maple,snow,sea}[key]||((c,t)=>city(c,t,key==='night')))(c,t);
 }
 c.fillStyle=gradient(c,552,720,...theme.ground);c.fillRect(0,552,1280,168);box(c,0,552,1280,5,0,key==='snow'?'#ffffff':key==='night'?'#c4b8d580':'#fff2deaa');
 if(key==='sea'){for(let i=0;i<37;i++){const x=mod(i*127.39-t*130,1350)-30,y=583+seed(i)*130;oval(c,x,y,2+seed(i+5)*3,1.5,'#b19e8255');}}
 else{for(let i=-2;i<25;i++){const x=i*85-mod(t*150,85);line(c,[[x,558],[x*1.4-170,720]],key==='snow'?'#98b2c529':'#61577320',1);}for(let y=581;y<720;y+=36)line(c,[[0,y],[1280,y]],key==='snow'?'#98b2c522':'#61577320',1);}
 if(key==='maple')for(let i=0;i<35;i++){const x=mod(i*83.91-t*144,1340)-30,y=561+seed(i)*130;c.save();c.translate(x,y);c.rotate(seed(i+11)*7);leaf(c,5+seed(i+2)*4,i%2?'#c36b515f':'#efb97680');c.restore();}
 c.restore();return theme;
 }
 function petal(c,s,color){c.fillStyle=color;c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*1.4,-s,s*1.5,s*.5,0,s);c.bezierCurveTo(-s*.8,s*.4,-s*.6,-s*.3,0,-s);c.fill();}
 function leaf(c,s,color){c.fillStyle=color;c.beginPath();const pts=[[0,-1.4],[.28,-.62],[.83,-.95],[.66,-.27],[1.26,-.2],[.64,.27],[.77,.82],[.2,.67],[0,1.2],[-.2,.67],[-.77,.82],[-.64,.27],[-1.26,-.2],[-.66,-.27],[-.83,-.95],[-.28,-.62]];pts.forEach(([x,y],i)=>i?c.lineTo(x*s,y*s):c.moveTo(x*s,y*s));c.closePath();c.fill();line(c,[[0,-s*.9],[0,s*1.35]],'#925b5766',.7);}
 function ambient(c,t,key,type='auto',amount=65,front=false){type=type==='auto'?(themes[key]||themes.campus).particle:type;if(type==='none'||amount<=0)return;const count=Math.round(amount*(front?.32:.72));c.save();for(let i=0;i<count;i++){const n=i+(front?800:0),speed=type==='snow'?21:type==='dust'?7:36;const x=mod(seed(n)*1380-t*(18+seed(n+3)*45)+Math.sin(t*.7+n)*27,1400)-60,y=mod(seed(n+7)*820+t*speed*(.5+seed(n+5)),820)-50,s=(front?5:3)+seed(n+9)*(front?5:4);c.save();c.translate(x,y);c.rotate(t*(seed(n+12)-.5)+n);c.globalAlpha=front?.55:.4;
 if(type==='petals'){c.scale(.45+Math.abs(Math.sin(t+n))*.7,1);petal(c,s,i%3?'#ffe0ed':'#f9b6d2');}
 else if(type==='leaves'){c.scale(.5+Math.abs(Math.sin(t*.8+n))*.5,1);leaf(c,s,['#d97146','#f4b44e','#bb6753'][i%3]);}
 else if(type==='snow'){oval(c,0,0,s*.42,s*.42,'#ffffff');if(front&&i%4===0)for(let k=0;k<3;k++){c.rotate(Math.PI/3);line(c,[[-s,0],[s,0]],'#f4fcff',1);}}
 else{const glow=type==='fireflies';c.globalAlpha=(front?.4:.25)*(.65+.35*Math.sin(t*2+i));oval(c,0,0,s*(glow?.5:.3),s*(glow?.5:.3),glow?'#ecffaf':key==='sea'?'#ffffff':'#fff6dc');if(glow)oval(c,0,0,s*1.9,s*1.9,'#d9ff8320');}
 c.restore();}c.restore();}
 root.SevenWorlds={themes,draw,ambient};
})(window);
