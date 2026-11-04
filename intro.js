window.__sky=window.__sky||{rev:0,goal:0};
/* オープニング: ターミナルで go run main.go を実行して名前を出す。終わったら下にスクロールして本体へ。
   左上の「永田 來煉」を押すと、トップに戻ってもう一度流れる */
(function(){
  var root=document.documentElement, intro=document.getElementById('intro');
  if(!intro)return;
  var nav=document.querySelector('.gnav'), scene=document.getElementById('scene'), skipBtn=document.getElementById('skip'), run=0;
  var reduce=false; try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  function fit(){root.style.setProperty('--nav',nav.offsetHeight+'px');}
  fit(); window.addEventListener('resize',fit); window.addEventListener('load',fit);
  if(window.ResizeObserver)new ResizeObserver(fit).observe(nav);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);

  var mods=['golang.org/x/sys v0.15.0','golang.org/x/text v0.14.0','golang.org/x/net v0.19.0','golang.org/x/crypto v0.16.0','golang.org/x/arch v0.6.0','github.com/gin-gonic/gin v1.9.1','github.com/gin-contrib/sse v0.1.0','github.com/go-playground/validator/v10 v10.16.0','github.com/go-playground/locales v0.14.1','github.com/go-playground/universal-translator v0.18.1','github.com/leodido/go-urn v1.2.4','github.com/gabriel-vasile/mimetype v1.4.3','github.com/pelletier/go-toml/v2 v2.1.0','github.com/ugorji/go/codec v1.2.11','github.com/bytedance/sonic v1.10.2','github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d','github.com/chenzhuoyu/iasm v0.9.1','github.com/twitchyliquid64/golang-asm v0.15.1','github.com/klauspost/cpuid/v2 v2.2.6','github.com/goccy/go-json v0.10.2','github.com/json-iterator/go v1.1.12','github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd','github.com/modern-go/reflect2 v1.0.2','github.com/mattn/go-isatty v0.0.20','google.golang.org/protobuf v1.31.0','gopkg.in/yaml.v3 v3.0.1','github.com/stretchr/testify v1.8.4','github.com/davecgh/go-spew v1.1.1','github.com/pmezard/go-difflib v1.0.0','github.com/jackc/pgx/v5 v5.5.0','github.com/jackc/pgpassfile v1.0.0','github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a','github.com/jackc/puddle/v2 v2.2.1','github.com/joho/godotenv v1.5.1','github.com/rs/zerolog v1.31.0','github.com/mattn/go-colorable v0.1.13','github.com/spf13/cobra v1.8.0','github.com/spf13/pflag v1.0.5','github.com/inconshreveable/mousetrap v1.1.0','github.com/google/uuid v1.4.0','github.com/golang-jwt/jwt/v5 v5.2.0','github.com/redis/go-redis/v9 v9.3.0','github.com/cespare/xxhash/v2 v2.2.0','github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f','go.uber.org/zap v1.26.0','go.uber.org/multierr v1.11.0','github.com/prometheus/client_golang v1.17.0','github.com/beorn7/perks v1.0.1','github.com/prometheus/common v0.45.0'];
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function el(c,h){var e=document.createElement('div');if(c)e.className=c;e.innerHTML=h||'';return e;}
  async function typeInto(n,t,ms,alive){for(var i=0;i<t.length;i++){if(!alive())return false;n.textContent+=t[i];await sleep(ms);}return true;}
  function seen(){try{sessionStorage.setItem('introSeen','1');}catch(e){}}
  function clearHint(){var h=intro.querySelector('.hint');if(h)h.remove();}
  /* 「下にスクロール」の案内: 画面の下の中央。押すと本体へ滑らかに移動する */
  function addHint(){
    clearHint();
    var h=el('hint','<span>下にスクロール</span><b>⌄</b>');
    h.setAttribute('role','button'); h.tabIndex=0;
    function go(){window.scrollTo({top:intro.offsetHeight,behavior:reduce?'auto':'smooth'});}
    h.addEventListener('click',go);
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    intro.appendChild(h);
  }
  function finish(jump){
    run++; seen(); if(window.__sky)window.__sky.goal=1; skipBtn.hidden=true; nav.removeAttribute('inert'); clearHint();
    root.classList.remove('playing');
    if(jump)window.scrollTo(0,intro.offsetHeight); else addHint();
  }
  async function play(alive){
    var win=el('win','<div class="tb"><i></i><i></i><i></i><span>kuren — -zsh — 80×24</span></div>');
    var t=el('t'); win.appendChild(t); scene.appendChild(win);
    var p=el('','<span class="pr">kuren@mac</span> <span class="dim">~</span> % <span id="cmd"></span><span class="caret"></span>'); t.appendChild(p);
    /* 枠の大きさは固定。go run が依存パッケージを取得するときの出力が次々に流れ、あふれた分は上へ流れていく。止まったあとに名前が出る */
    function add(e){t.appendChild(e);t.scrollTop=t.scrollHeight;return e;}
    await sleep(500); if(!alive())return false;
    if(!await typeInto(p.querySelector('#cmd'),'go run main.go',70,alive))return false;
    await sleep(350); if(!alive())return false;
    p.querySelector('.caret').remove();
    for(var i=0;i<mods.length;i++){
      add(el('lg','go: downloading '+mods[i]));
      await sleep(i<4?160:28); if(!alive())return false;
    }
    await sleep(450); if(!alive())return false;
    add(el('','&nbsp;'));
    add(el('fi','<span class="dim">&gt;</span> 公立はこだて未来大学 3年'));
    await sleep(350); if(!alive())return false;
    add(el('oname fi','永田 來煉'));
    await sleep(500); if(!alive())return false;
    add(el('fi','<span class="dim">exit status 0</span>'));
    await sleep(700);
    return alive();
  }
  function renderFinal(){
    scene.innerHTML='';
    var win=el('win','<div class="tb"><i></i><i></i><i></i><span>kuren — -zsh — 80×24</span></div>');
    var t=el('t'); win.appendChild(t); scene.appendChild(win);
    t.appendChild(el('','<span class="pr">kuren@mac</span> <span class="dim">~</span> % go run main.go'));
    for(var i=0;i<mods.length;i++)t.appendChild(el('lg','go: downloading '+mods[i]));
    t.appendChild(el('','&nbsp;'));
    t.appendChild(el('','<span class="dim">&gt;</span> 公立はこだて未来大学 3年'));
    t.appendChild(el('oname','永田 來煉'));
    t.appendChild(el('','<span class="dim">exit status 0</span>'));
    requestAnimationFrame(function(){t.scrollTop=t.scrollHeight;});
    if(window.__sky){window.__sky.rev=1;window.__sky.goal=1;}
    addHint();
  }
  function start(){
    var id=++run; if(window.__sky){window.__sky.rev=0;window.__sky.goal=0;}
    scene.innerHTML=''; clearHint();
    skipBtn.hidden=false; nav.setAttribute('inert','');
    root.classList.remove('noi'); root.classList.add('playing');
    fit(); window.scrollTo(0,0); try{window.dispatchEvent(new Event('introreplay'));}catch(e){}
    function go(){play(function(){return id===run;}).then(function(ok){if(ok)finish(false);});}
    if(document.visibilityState==='hidden'){document.addEventListener('visibilitychange',function o(){if(document.visibilityState==='visible'){document.removeEventListener('visibilitychange',o);go();}});}
    else go();
  }
  skipBtn.addEventListener('click',function(){finish(true);});


  /* 「永田 來煉」を押したらトップに戻ってオープニングをもう一度流す(「動きを減らす」設定のときは戻るだけ) */
  var brand=document.querySelector('.gnav .brand');
  if(brand)brand.addEventListener('click',function(ev){
    if(reduce)return;
    ev.preventDefault();
    window.__introReplay=true;
    start();
    if(location.hash==='#home'||location.hash===''){window.__introReplay=false;if(location.hash==='')history.replaceState(null,'','#home');}
    else location.hash='#home';
  });

  if(root.classList.contains('playing'))start();
  else renderFinal();
  /* ホームに戻ったら、最後まで流れた状態のオープニングの下(取り組み)に着地。上にスライドすればオープニングに戻れる */
  window.addEventListener('hashchange',function(){
    if(root.classList.contains('playing'))return;
    var hh=location.hash.slice(1).split('/')[0];
    if(hh===''||hh==='home'){renderFinal();setTimeout(function(){window.scrollTo(0,intro.offsetHeight);},0);}
  });
})();

/* オープニングの背景: 函館山と函館湾。空・海・山は最初から見えていて、ターミナルが終わると星がまばらに出て山頂のライトが点く */
(function(){
  var intro=document.getElementById('intro');
  if(!intro)return;
  var sky=window.__sky;
  var cv=document.createElement('canvas'); cv.className='sky'; cv.setAttribute('aria-hidden','true');
  intro.insertBefore(cv,intro.firstChild);
  var ctx=cv.getContext&&cv.getContext('2d'); if(!ctx)return;
  var reduce=false; try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
  var W=0,H=0,hz=0,stars=[],refl=[],mt=[],peak=[0,0],raf=0,t0=performance.now(),last=0,built='';
  var harb={};
  function rnd(a,b){return a+Math.random()*(b-a);}
  function clamp(x){return Math.max(0,Math.min(1,x));}
  function sm(x){x=clamp(x);return x*x*(3-2*x);}
  function vis(th){return clamp((sky.rev-th)/0.06);}
  function build(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    W=cv.clientWidth; H=cv.clientHeight; if(!W||!H)return false;
    cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    hz=H*0.70;
    stars=[]; var n=Math.round(W/9);
    for(var i=0;i<n;i++){
      stars.push({x:rnd(0,W),y:Math.pow(Math.random(),1.3)*hz*0.95,r:rnd(.5,1.5),ph:rnd(0,6.28),sp:rnd(.6,2),f:Math.random()<.18,th:Math.random()});
    }
    refl=stars.filter(function(s){return s.r>1.05;}).slice(0,26).map(function(s){return {s:s,x:s.x,len:rnd(14,46),ph:s.ph,sp:s.sp};});
    /* 函館山: 画面の右側に置く(ターミナルに重ならない位置) */
    /* 函館山(臥牛山): 街側(左)はゆるやかに上がり、頂上(御殿山)のあと千畳敷のような台地が続き、右の海側は断崖で落ちる */
    var mx0=W*(W<700?0.76:0.75), mx1=W*(W<700?1.0:0.99), mh=Math.min(H*0.185,138); mt=[]; peak=[0,hz];
    for(var j=0;j<=140;j++){
      var u=j/140, x=mx0+(mx1-mx0)*u, h;
      if(u<=0.40)h=0.95*Math.pow(sm(u/0.40),1.15)+0.035*Math.exp(-Math.pow((u-0.2)/0.05,2));
      else if(u<=0.52)h=0.95-0.29*sm((u-0.40)/0.12);
      else if(u<=0.80)h=0.66-0.10*(u-0.52)/0.28;
      else if(u<=0.955)h=0.56*(1-sm((u-0.80)/0.155));
      else h=0;
      h+=0.012*Math.sin(u*47)+0.008*Math.sin(u*121+.6); h=Math.max(0,h)*(u>0.945?Math.max(0,1-(u-0.945)/0.05):1)*sm(u/0.03);
      var y=hz+2-mh*h; mt.push([x,y]); if(y<peak[1])peak=[x,y];
    }
    /* 手前の港: 防波堤と灯台、停泊する船、岸壁、倉庫、クレーン、街灯 */
    var qy=H*0.90, qx1=W*(W<700?0.64:0.46), wy=H*0.785;
    harb={qy:qy,qx1:qx1,wy:wy,wh:H*0.014,wx1:W*(W<700?0.62:0.50),lh:H*0.048,
      boats:[],wins:[],lamps:[],crane:{x:W*0.275,h:H*0.125},
      wh_:[{x:0,w:W*0.105,h:H*0.055},{x:W*0.115,w:W*0.075,h:H*0.04}]};
    var bx=[.215,.335,.42];
    for(var bi=0;bi<bx.length;bi++){harb.boats.push({x:W*bx[bi]*(W<700?1.1:1),w:rnd(36,56),m:rnd(30,46),sail:Math.random()<.4,ph:rnd(0,6.28),th:rnd(.2,.6)});}
    harb.wh_.forEach(function(r){
      /* 倉庫の窓は1列だけ、数も少なめ(マンションに見えないように) */
      for(var wx=r.x+8;wx<r.x+r.w-16;wx+=22){
        if(Math.random()<.5)harb.wins.push({x:wx,y:qy-r.h*.55,th:rnd(.1,.75),ph:rnd(0,6.28)});
      }
    });
    [.03,.16,.304,.396].forEach(function(f,i){harb.lamps.push({x:W*f,th:.1+i*.07});});
    return true;
  }
  function draw(now){
    var t=(now-t0)/1000, i, s, dt=last?Math.min(64,now-last):16; last=now;
    if(reduce)sky.rev=sky.goal;
    else if(sky.rev<sky.goal)sky.rev=Math.min(sky.goal,sky.rev+dt/2600);
    else if(sky.rev>sky.goal)sky.rev=Math.max(sky.goal,sky.rev-dt/400);
    ctx.clearRect(0,0,W,H);
    /* 空 */
    var g=ctx.createLinearGradient(0,0,0,hz);
    g.addColorStop(0,'#01030B'); g.addColorStop(.7,'#071634'); g.addColorStop(1,'#13264A');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,hz+4);
    /* 星: まばらに、少しずつ現れる */
    for(i=0;i<stars.length;i++){
      s=stars[i]; var v=vis(s.th); if(v<=0)continue;
      var tw=reduce?.8:(.2+.8*Math.max(0,Math.sin(t*s.sp*1.25+s.ph)));
      ctx.globalAlpha=tw*v; ctx.fillStyle='#E6EEF8'; ctx.fillRect(s.x,s.y,s.r,s.r);
      if(s.f&&tw>.7&&v>.9){var fk=(tw-.7)/.3; ctx.globalAlpha=fk*.9; ctx.fillRect(s.x-5*fk,s.y+s.r/2-.35,s.r+10*fk,.7);ctx.fillRect(s.x+s.r/2-.35,s.y-5*fk,.7,s.r+10*fk);
        ctx.globalAlpha=fk*.25; ctx.beginPath(); ctx.arc(s.x+s.r/2,s.y+s.r/2,3+2*fk,0,6.29); ctx.fill();}
    }
    ctx.globalAlpha=1;
    /* 海 */
    var sea=ctx.createLinearGradient(0,hz,0,H);
    sea.addColorStop(0,'#0B2038'); sea.addColorStop(1,'#040C18');
    ctx.fillStyle=sea; ctx.fillRect(0,hz,W,H-hz);
    /* 海に映る星 */
    for(i=0;i<refl.length;i++){
      var r=refl[i], sv=vis(r.s.th); if(sv<=0)continue;
      for(var d=0;d<r.len;d+=5){
        var al=.34*(1-d/r.len)*sv*(reduce?.8:(.6+.4*Math.sin(t*r.sp*1.3+r.ph+d)));
        ctx.globalAlpha=Math.max(0,al); ctx.fillStyle='#BFD6F0';
        var w=1.6+(reduce?0:Math.sin(t*1.7+d*.7+r.ph)*1.1);
        ctx.fillRect(r.x-w/2,hz+3+d,w,1.1);
      }
    }
    ctx.globalAlpha=1;
    /* 海に映る函館山: 逆さに、うすく、ゆらゆらと */
    if(!window.__noReflect){
      var mtop=hz+2-peak[1], refH=mtop*0.85;
      for(var dd=0;dd<refH;dd+=2){
        var thr=dd/0.85, i1=-1, i2=-1;
        for(i=0;i<mt.length;i++){ if(hz+2-mt[i][1]>=thr){ if(i1<0)i1=i; i2=i; } }
        if(i1<0)break;
        var sway=reduce?0:Math.sin(t*1.1+dd*.22)*(0.8+dd*.045);
        var ra=.5*(1-dd/refH)*(reduce?1:(.72+.28*Math.sin(t*1.6+dd*.5)));
        ctx.fillStyle='rgba(2,8,18,'+Math.max(0,ra)+')';
        ctx.fillRect(mt[i1][0]+sway,hz+3+dd,mt[i2][0]-mt[i1][0],2);
      }
    }
    /* 函館山 */
    ctx.beginPath(); ctx.moveTo(mt[0][0],hz+8);
    for(i=0;i<mt.length;i++)ctx.lineTo(mt[i][0],mt[i][1]);
    ctx.lineTo(mt[mt.length-1][0],hz+8); ctx.closePath();
    var mg=ctx.createLinearGradient(0,peak[1],0,hz+8);
    mg.addColorStop(0,'#0A1730'); mg.addColorStop(.45,'#050E1F'); mg.addColorStop(1,'#02070F');
    ctx.fillStyle=mg; ctx.fill();
    ctx.strokeStyle='rgba(150,180,220,.30)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(mt[0][0],mt[0][1]);
    for(i=1;i<mt.length;i++)ctx.lineTo(mt[i][0],mt[i][1]);
    ctx.stroke();
    if(!window.__noReflect){
      var onr=clamp((sky.rev-.5)/.5);
      if(onr>0){for(var rr=0;rr<46;rr+=4){
        var rs=reduce?0:Math.sin(t*1.5+rr*.4)*2;
        ctx.globalAlpha=.22*onr*(1-rr/46); ctx.fillStyle='#FFE2A8';
        ctx.fillRect(peak[0]-1+rs*.6+0,hz+4+(hz+2-peak[1])*.85*0+rr+(hz+2-peak[1])*.0,2.2+Math.abs(rs)*.3,1.4);
      }ctx.globalAlpha=1;}
    }
    /* 手前の港 */
    var D='#030A14', hb=harb, bl=reduce?1:(Math.sin(t*2.6)>.5?1:.2);
    ctx.fillStyle=D;
    ctx.fillRect(0,hb.wy,hb.wx1,hb.wh);                       /* 防波堤 */
    ctx.beginPath(); ctx.moveTo(hb.wx1-4,hb.wy); ctx.lineTo(hb.wx1-2.5,hb.wy-hb.lh); ctx.lineTo(hb.wx1+2.5,hb.wy-hb.lh); ctx.lineTo(hb.wx1+4,hb.wy); ctx.closePath(); ctx.fill();
    ctx.fillRect(hb.wx1-4.5,hb.wy-hb.lh-4,9,4);                /* 灯台 */
    for(i=0;i<hb.boats.length;i++){                            /* 停泊する船 */
      var B=hb.boats[i], by=H*0.865;
      ctx.fillStyle=D; ctx.beginPath(); ctx.moveTo(B.x,by); ctx.lineTo(B.x+B.w,by); ctx.lineTo(B.x+B.w-6,by+7); ctx.lineTo(B.x+6,by+7); ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(160,190,220,.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(B.x,by); ctx.lineTo(B.x+B.w,by); ctx.stroke();
      if(B.sail){ctx.beginPath(); ctx.moveTo(B.x+B.w*.45,by-B.m); ctx.lineTo(B.x+B.w*.45,by-2); ctx.lineTo(B.x+B.w*.9,by-2); ctx.closePath(); ctx.fill();}
      else ctx.fillRect(B.x+B.w*.5,by-10,12,10);
      ctx.fillRect(B.x+B.w*.45-.8,by-B.m,1.6,B.m);
    }
    ctx.beginPath(); ctx.moveTo(0,hb.qy); ctx.lineTo(hb.qx1,hb.qy); ctx.lineTo(hb.qx1+W*.05,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();   /* 岸壁 */
    for(i=0;i<hb.wh_.length;i++){var R2=hb.wh_[i]; ctx.fillRect(R2.x,hb.qy-R2.h,R2.w,R2.h);}                                               /* 倉庫 */
    ctx.strokeStyle=D; ctx.lineWidth=4; ctx.beginPath();       /* クレーン */
    var cr=hb.crane; ctx.moveTo(cr.x,hb.qy); ctx.lineTo(cr.x,hb.qy-cr.h); ctx.moveTo(cr.x-cr.h*.22,hb.qy-cr.h); ctx.lineTo(cr.x+cr.h*.6,hb.qy-cr.h);
    ctx.moveTo(cr.x+cr.h*.6,hb.qy-cr.h); ctx.lineTo(cr.x+cr.h*.6,hb.qy-cr.h+cr.h*.22); ctx.stroke();
    for(i=0;i<hb.lamps.length;i++){ctx.fillRect(hb.lamps[i].x-.8,hb.qy-H*.034,1.6,H*.034);}                                                  /* 街灯の柱 */
    ctx.strokeStyle='rgba(160,190,220,.18)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,hb.qy); ctx.lineTo(hb.qx1,hb.qy); ctx.stroke();
    /* 港の灯り: ターミナルが終わったあと点く */
    function glow(x,y,rad,c,al){var g2=ctx.createRadialGradient(x,y,0,x,y,rad);g2.addColorStop(0,'rgba('+c+','+al+')');g2.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g2;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);}
    for(i=0;i<hb.wins.length;i++){var Wn=hb.wins[i], wv=vis(Wn.th); if(wv<=0)continue; ctx.globalAlpha=wv*(reduce?.9:(.75+.25*Math.sin(t*.9+Wn.ph))); ctx.fillStyle='#FFD27A'; ctx.fillRect(Wn.x,Wn.y,9,3);}
    ctx.globalAlpha=1;
    for(i=0;i<hb.lamps.length;i++){var Lp=hb.lamps[i], lv=vis(Lp.th); if(lv<=0)continue; glow(Lp.x,hb.qy-H*.034,12,'255,222,150',.7*lv); ctx.fillStyle='rgba(255,244,214,'+lv+')'; ctx.fillRect(Lp.x-1.5,hb.qy-H*.034-1.5,3,3);}
    for(i=0;i<hb.boats.length;i++){var B2=hb.boats[i], bv=vis(B2.th); if(bv<=0)continue; var bby=H*.865; ctx.fillStyle='rgba(255,236,170,'+bv+')'; ctx.fillRect(B2.x+B2.w*.45-1.5,bby-B2.m-3,3,3); ctx.fillStyle='rgba(120,255,160,'+(.8*bv)+')'; ctx.fillRect(B2.x+B2.w-2,bby,2,2);}
    var lvh=vis(.3); if(lvh>0){glow(hb.wx1,hb.wy-hb.lh-2,14,'255,226,160',.6*lvh); ctx.fillStyle='rgba(255,246,220,'+lvh+')'; ctx.fillRect(hb.wx1-2,hb.wy-hb.lh-4,4,3);}
    var cv2=vis(.4); if(cv2>0){ctx.fillStyle='rgba(255,236,190,'+(cv2*.9)+')'; ctx.fillRect(cr.x-1.5,hb.qy-cr.h-5,3,3);}
    /* 山頂のライト: ターミナルが終わったあと点く */
    var on=clamp((sky.rev-.5)/.5);
    if(on>0){
      var a=on;
      var R=Math.max(32,Math.min(50,W*0.04));
      var gl=ctx.createRadialGradient(peak[0],peak[1],0,peak[0],peak[1],R);
      gl.addColorStop(0,'rgba(255,238,190,'+(.75*a)+')'); gl.addColorStop(.3,'rgba(255,214,130,'+(.3*a)+')'); gl.addColorStop(1,'rgba(255,214,130,0)');
      ctx.fillStyle=gl; ctx.fillRect(peak[0]-R,peak[1]-R,R*2,R*2);
      ctx.fillStyle='rgba(255,246,220,'+a+')'; ctx.fillRect(peak[0]-2,peak[1]-1.5,4,3);
      ctx.fillStyle='rgba(255,236,190,'+(.8*a)+')'; ctx.fillRect(peak[0]+7,peak[1]+2,1.8,1.8); ctx.fillRect(peak[0]-9,peak[1]+3,1.8,1.8);
      ctx.fillStyle='rgba(255,246,220,'+on+')'; ctx.fillRect(peak[0]+2,peak[1]-8,2,2);
    }
  }
  function visible(){return intro.offsetHeight>0&&!document.hidden;}
  function loop(now){raf=0; if(!visible())return; draw(now); raf=requestAnimationFrame(loop);}
  function kick(){
    if(!visible())return;
    var sz=cv.clientWidth+'x'+cv.clientHeight;
    if(sz!==built){ if(!build())return; built=sz; }
    if(!raf)raf=requestAnimationFrame(loop);
  }
  var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(kick,120);});
  if(window.ResizeObserver)new ResizeObserver(function(){clearTimeout(rt);rt=setTimeout(kick,60);}).observe(intro);
  document.addEventListener('visibilitychange',kick);
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){if(e[0].isIntersecting)kick();else{cancelAnimationFrame(raf);raf=0;}}).observe(intro);
  kick();
})();
