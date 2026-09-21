/* Explicit phrase colors and user-selected silhouettes; never random note appearance. */
(function(root){'use strict';
 const palettes={cyan:{name:'青蓝汽水',main:'#35dce8',light:'#bdfbff',dark:'#1886b1'},pink:{name:'草莓粉',main:'#fa73b5',light:'#ffd9ed',dark:'#be438b'},mint:{name:'薄荷绿',main:'#75e3b4',light:'#d7fff0',dark:'#2caa91'},purple:{name:'葡萄紫',main:'#ae8ae9',light:'#e8dbff',dark:'#7357b6'},yellow:{name:'柠檬黄',main:'#f3d64f',light:'#fff7bf',dark:'#bd9633'},orange:{name:'蜜桃橙',main:'#f6ad77',light:'#ffe5c8',dark:'#cb7554'}};
 const shapes={upper:'飞翼独眼',lower:'尖角怪兽',bat:'霓虹蝙蝠',bunny:'兔耳团子',star:'星星糖',cat:'猫耳音箱',ufo:'飞碟怪',slime:'独眼果冻'};
 const defaults={cyan:'upper',pink:'cat',mint:'bunny',purple:'bat',yellow:'star',orange:'slime'};
 function color(n,settings={}){return palettes[n.color]?n.color:(settings.laneColors?.[n.lane] in palettes?settings.laneColors[n.lane]:n.lane?'pink':'cyan');}
 function shape(n,settings={}){return shapes[n.skin]?n.skin:shapes[settings.colorShapes?.[color(n,settings)]]?settings.colorShapes[color(n,settings)]:defaults[color(n,settings)];}
 function recolor(svg,palette){const doc=new DOMParser().parseFromString(svg,'image/svg+xml');for(const el of doc.querySelectorAll('*'))for(const attr of ['fill','stroke']){const raw=el.getAttribute(attr);if(!/^#[\da-f]{6}$/i.test(raw||''))continue;const rgb=[1,3,5].map(i=>parseInt(raw.slice(i,i+2),16)),max=Math.max(...rgb),min=Math.min(...rgb);if(max<125||min>238)continue;el.setAttribute(attr,max-min<50&&max>210?palette.light:max>220?palette.main:palette.dark);}return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(doc));}
 async function build(assets,loadImage){const sprites={};await Promise.all(Object.entries(palettes).flatMap(([key,p])=>Object.keys(shapes).map(async shape=>{const source=atob(assets[shape].split(',')[1]);sprites[key+':'+shape]=await loadImage(recolor(source,p));})));return sprites;}
 root.SevenColors={palettes,shapes,defaults,color,shape,build};if(typeof module!=='undefined')module.exports=root.SevenColors;
})(typeof window!=='undefined'?window:globalThis);
