// Helpers
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));

// Typewriter
(function(){
  const el = $('#typewriter');
  if(!el) return;
  const txt = el.getAttribute('data-text') || '';
  let i = 0;
  function type(){
    el.textContent = txt.slice(0, i) + (i % 2 ? '_' : ' ');
    i = Math.min(i+1, txt.length);
    setTimeout(type, 80);
  }
  type();
})();

// Reveal on scroll
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: .18 });
  $$('.reveal').forEach(el => obs.observe(el));
})();

// Matrix rain
const Matrix = (()=>{
  const c = $('#matrix'); if(!c) return {toggle:()=>{}};
  const ctx = c.getContext('2d');
  let drops = [], running = true, W=0, H=0, fontSize=14;
  function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight; drops = new Array(Math.floor(W / fontSize)).fill(1); }
  window.addEventListener('resize', resize); resize();
  const letters = 'アカサタナハマヤラワ01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=-';
  function draw(){
    if(!running) return requestAnimationFrame(draw);
    ctx.fillStyle = 'rgba(0, 8, 16, 0.07)'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#22d3ee'; ctx.font = fontSize + 'px JetBrains Mono, monospace';
    for(let i=0;i<drops.length;i++){
      const text = letters[Math.floor(Math.random()*letters.length)];
      ctx.fillText(text, i*fontSize, drops[i]*fontSize);
      if(drops[i]*fontSize > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  return { toggle(){ running = !running; if(running) requestAnimationFrame(draw); } };
})();

// Stars parallax
(function(){
  const c = $('#stars'); if(!c) return;
  const ctx = c.getContext('2d');
  let w,h; let stars=[];
  function resize(){ w = c.width = window.innerWidth; h = c.height = window.innerHeight; stars = Array.from({length:150},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*2+.2})); }
  window.addEventListener('resize', resize); resize();
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const r = s.z*1.2; ctx.fillStyle = `rgba(125, 211, 252, ${.2 + s.z/2})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 2*Math.PI); ctx.fill();
      s.x += (Math.sin(Date.now()/1000 + s.y)*.05)*s.z;
      s.y += (.03 + s.z*.02);
      if(s.y>h){ s.y = -5; s.x = Math.random()*w; }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// Tilt effect
(function(){
  const els = $$('.tilt');
  els.forEach(el=>{
    const r = 8;
    el.addEventListener('mousemove', e=>{
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rx = ((y/rect.height)-.5)*-r;
      const ry = ((x/rect.width)-.5)*r;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'; });
  });
})();

// Live counters
(function(){
  $$('.stat-number').forEach(el=>{
    const target = parseInt(el.getAttribute('data-target')||'0',10);
    let cur = 0;
    const step = Math.max(1, Math.floor(target/60));
    const tick = ()=>{ cur = Math.min(target, cur + step); el.textContent = cur; if(cur<target) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
})();

// Expose skills for radar
window.SKILLS = (function(){
  try{ return JSON.parse(document.querySelector('script#skills-data').textContent); }
  catch(e){ return []; }
})();

// Radar chart (vanilla canvas)
(function(){
  const canvas = $('#radar'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = window.SKILLS || [];
  const W = canvas.width, H = canvas.height, cx=W/2, cy=H/2, r=Math.min(W,H)*0.35;
  const N = data.length, levels=5;
  ctx.clearRect(0,0,W,H);
  // grid
  for(let l=1;l<=levels;l++){
    const rr = r*l/levels;
    ctx.beginPath();
    for(let i=0;i<N;i++){
      const a = (Math.PI*2 * i / N) - Math.PI/2;
      const x = cx + rr*Math.cos(a), y = cy + rr*Math.sin(a);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(34,211,238,.25)'; ctx.stroke();
  }
  // axes + labels
  ctx.font = "14px Inter"; ctx.fillStyle = "#bfeaff";
  data.forEach((d,i)=>{
    const a = (Math.PI*2 * i / N) - Math.PI/2;
    const x = cx + (r+14)*Math.cos(a), y = cy + (r+14)*Math.sin(a);
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx + r*Math.cos(a), cy + r*Math.sin(a)); ctx.strokeStyle = 'rgba(34,211,238,.25)'; ctx.stroke();
    ctx.fillText(d.name, x-20, y+5);
  });
  // values
  ctx.beginPath();
  data.forEach((d,i)=>{
    const a = (Math.PI*2 * i / N) - Math.PI/2;
    const rr = r * (d.value/100);
    const x = cx + rr*Math.cos(a), y = cy + rr*Math.sin(a);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.closePath(); ctx.fillStyle='rgba(34,211,238,.16)'; ctx.strokeStyle='#22d3ee'; ctx.lineWidth=2; ctx.fill(); ctx.stroke();
})();

// Panel actions
(function(){
  const btnMatrix = $('#toggle-matrix');
  const btnNoise = $('#toggle-noise');
  const btnTheme = $('#theme-btn');
  const noise = $('.noise');
  let aggro = false;
  if(btnMatrix) btnMatrix.addEventListener('click', ()=> Matrix.toggle());
  if(btnNoise) btnNoise.addEventListener('click', ()=> noise.style.display = (noise.style.display==='none'?'':'none'));
  if(btnTheme) btnTheme.addEventListener('click', ()=>{
    aggro = !aggro; btnTheme.textContent = aggro ? 'Stealth' : 'Aggro';
    document.documentElement.style.setProperty('--accent', aggro ? '#f472b6' : '#22d3ee');
  });
})();

// Copy buttons
(function(){
  function copy(text){
    navigator.clipboard.writeText(text).then(()=>{
      const toast = document.createElement('div');
      toast.textContent = 'Copied!';
      toast.style.cssText = 'position:fixed;bottom:14%;left:50%;transform:translateX(-50%);padding:.4rem .7rem;background:rgba(6,182,212,.2);border:1px solid rgba(34,211,238,.4);color:#bff;backdrop-filter:blur(4px);border-radius:.6rem;z-index:50;';
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(), 800);
    });
  }
  $$('.copy, .copy-xs').forEach(btn=>btn.addEventListener('click', ()=> copy(btn.getAttribute('data-copy')) ));
})();

// Command Palette (Ctrl/Cmd + K)
(function(){
  const overlay = $('#palette'), input = $('#palette-input'), list = $('#palette-list'), btn = $('#cmdk');
  const items = [
    {label:'About', hash:'#about'},
    {label:'Projects', hash:'#projects'},
    {label:'Exercises', hash:'#exercises'},
    {label:'Contact', hash:'#contact'}
  ];
  function open(){ overlay.classList.remove('hidden'); input.value=''; render(''); input.focus(); }
  function close(){ overlay.classList.add('hidden'); }
  function render(q){
    list.innerHTML = '';
    items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())).forEach(i=>{
      const li = document.createElement('li'); li.textContent = i.label; li.onclick = () => { location.hash = i.hash; close(); };
      list.appendChild(li);
    });
  }
  if(btn) btn.addEventListener('click', open);
  input && input.addEventListener('input', e=> render(e.target.value));
  window.addEventListener('keydown', e=>{
    const mac = navigator.platform.toUpperCase().includes('MAC');
    if((mac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); }
    if(e.key==='Escape') close();
  });
})();

// Konami => red alert
(function(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let i = 0;
  window.addEventListener('keydown', e=>{
    i = (e.key === seq[i]) ? (i+1) : 0;
    if(i===seq.length){ i=0; $('#red-alert').classList.toggle('hidden'); }
  });
})();


