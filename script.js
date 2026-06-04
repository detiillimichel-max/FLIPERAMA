const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
const W=cv.width,H=cv.height;
let ball={x:W-60,y:H-220,r:10,vx:0,vy:0,held:true},left=false,right=false,score=0,balls=3;
const flippers=[
 {x:W*0.30,y:H-150,len:100,ang:0.6,rest:0.6,active:-0.6,w:22},
 {x:W*0.70,y:H-150,len:100,ang:Math.PI-0.6,rest:Math.PI-0.6,active:Math.PI+0.6,w:22}
];
// Realistic layout: 3 top bumpers triangle, 2 slingshots, side lanes
const bumpers=[
 {x:W*0.5,y:H*0.28,r:32,val:100},
 {x:W*0.35,y:H*0.38,r:30,val:100},
 {x:W*0.65,y:H*0.38,r:30,val:100}
];
const slings=[
 {x:W*0.22,y:H-220,ang:-0.8},
 {x:W*0.78,y:H-220,ang:Math.PI+0.8}
];
let theme=0;
function launch(){if(ball.held){ball.held=false;ball.vx=-0.5;ball.vy=-20}}
function resetBall(){ball.x=W-60;ball.y=H-220;ball.vx=0;ball.vy=0;ball.held=true}
resetBall();
function loop(){
 ctx.fillStyle='#0a0a0f';ctx.fillRect(0,0,W,H);
 // playfield
 ctx.fillStyle='#111827';ctx.fillRect(30,30,W-60,H-140);
 // launch lane
 ctx.fillStyle='#1f2937';ctx.fillRect(W-75,30,45,H-170);
 ctx.fillStyle='#374151';ctx.fillRect(W-80,30,5,H-170);
 // top arch
 ctx.strokeStyle='#374151';ctx.lineWidth=8;ctx.beginPath();ctx.arc(W/2,120,W/2-40,Math.PI,0);ctx.stroke();
 // bumpers
 bumpers.forEach(b=>{
   ctx.save();ctx.translate(b.x,b.y);
   const g=ctx.createRadialGradient(0,0,5,0,0,b.r);
   g.addColorStop(0,'#fff');g.addColorStop(1,'#f59e0b');
   ctx.fillStyle=g;ctx.shadowColor='#f59e0b';ctx.shadowBlur=15;
   ctx.beginPath();ctx.arc(0,0,b.r,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#000';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText(b.val,0,4);
   ctx.restore();
   if(!ball.held){const dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy);if(d<b.r+ball.r){const nx=dx/d,ny=dy/d;ball.vx=nx*12;ball.vy=ny*12;score+=b.val}}
 });
 // slingshots
 slings.forEach(s=>{
   ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);
   ctx.fillStyle='#dc2626';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(50,20);ctx.lineTo(50,-20);ctx.closePath();ctx.fill();
   ctx.restore();
 });
 // flippers
 flippers.forEach((f,i)=>{
   const target=(i===0?left:right)?f.active:f.rest;
   f.ang+=(target-f.ang)*0.5;
   ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.ang);
   ctx.fillStyle='#e5e7eb';ctx.fillRect(0,-f.w/2,f.len,f.w);
   ctx.fillStyle='#ef4444';ctx.beginPath();ctx.arc(0,0,f.w/2,0,Math.PI*2);ctx.fill();
   ctx.restore();
   if(!ball.held){
     const ex=f.x+Math.cos(f.ang)*f.len,ey=f.y+Math.sin(f.ang)*f.len;
     const lx=ex-f.x,ly=ey-f.y,l2=lx*lx+ly*ly;
     let t=((ball.x-f.x)*lx+(ball.y-f.y)*ly)/l2;t=Math.max(0,Math.min(1,t));
     const px=f.x+t*lx,py=f.y+t*ly,dx=ball.x-px,dy=ball.y-py,d=Math.hypot(dx,dy);
     if(d<ball.r+f.w/2){const nx=dx/d,ny=dy/d;ball.vx=nx*14;ball.vy=ny*14;score+=10}
   }
 });
 // walls
 ctx.fillStyle='#374151';
 ctx.fillRect(30,30,W-60,10);
 ctx.fillRect(30,30,10,H-140);
 ctx.fillRect(W-40,30,10,H-140);
 // bottom side close leaving center drain
 ctx.fillRect(40,H-160, W*0.25,10);
 ctx.fillRect(W-40-W*0.25, H-160, W*0.25,10);
 // ball physics
 if(!ball.held){ball.vy+=0.42;ball.x+=ball.vx;ball.y+=ball.vy;ball.vx*=0.999}
 if(ball.x<45+ball.r){ball.x=45+ball.r;ball.vx*=-0.7}
 if(ball.x>W-45-ball.r){ball.x=W-45-ball.r;ball.vx*=-0.7}
 if(ball.y<45+ball.r){ball.y=45+ball.r;ball.vy*=-0.7}
 // drain
 if(ball.y>H-130){const inDrain=ball.x>W*0.38 && ball.x<W*0.62; if(inDrain){balls--;document.getElementById('balls').textContent=balls;resetBall()} else if(ball.y>H-100){ball.vy=-8}}
 // draw ball
 ctx.save();ctx.translate(ball.x,ball.y);
 const gb=ctx.createRadialGradient(-3,-3,2,0,0,ball.r);gb.addColorStop(0,'#fff');gb.addColorStop(1,'#ef4444');
 ctx.fillStyle=gb;ctx.shadowColor='#ef4444';ctx.shadowBlur=12;
 ctx.beginPath();ctx.arc(0,0,ball.r,0,Math.PI*2);ctx.fill();
 ctx.restore();
 document.getElementById('score').textContent=score;
 requestAnimationFrame(loop);
}
document.getElementById('shopBtn').onclick=()=>document.getElementById('shop').classList.add('show');
document.getElementById('closeShop').onclick=()=>document.getElementById('shop').classList.remove('show');
document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{
 const it=b.dataset.buy;
 if(it==='ball'&&score>=500){score-=500;balls++}
 if(it==='nudge'&&score>=200){ball.vx+=(Math.random()-0.5)*6;ball.vy-=4}
 if(it==='theme'){document.body.style.filter=document.body.style.filter?'':'hue-rotate(180deg)'}
 document.getElementById('balls').textContent=balls;
});
document.getElementById('l').onpointerdown=()=>{left=true;if(ball.held)launch()};document.getElementById('l').onpointerup=()=>left=false;
document.getElementById('r').onpointerdown=()=>{right=true;if(ball.held)launch()};document.getElementById('r').onpointerup=()=>right=false;
loop();
