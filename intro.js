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

  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function el(c,h){var e=document.createElement('div');if(c)e.className=c;e.innerHTML=h||'';return e;}
  async function typeInto(n,t,ms,alive){for(var i=0;i<t.length;i++){if(!alive())return false;n.textContent+=t[i];await sleep(ms);}return true;}
  function seen(){try{sessionStorage.setItem('introSeen','1');}catch(e){}}
  function clearHint(){var h=intro.querySelector('.hint');if(h)h.remove();}
  function finish(jump){
    run++; seen(); skipBtn.hidden=true; nav.removeAttribute('inert'); clearHint();
    root.classList.remove('playing');
    if(jump){window.scrollTo(0,intro.offsetHeight);return;}
    var h=el('hint','<span>下にスクロール</span><b aria-hidden="true">↓</b>'); h.tabIndex=0; h.setAttribute('role','button');
    function go(){window.scrollTo({top:intro.offsetHeight,behavior:'smooth'});}
    h.addEventListener('click',go);
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    intro.appendChild(h);
  }
  async function play(alive){
    var win=el('win','<div class="tb"><i></i><i></i><i></i><span>kuren — -zsh — 80×24</span></div>');
    var t=el('t'); win.appendChild(t); scene.appendChild(win);
    var p=el('','<span class="pr">kuren@mac</span> <span class="dim">~</span> % <span id="cmd"></span><span class="caret"></span>'); t.appendChild(p);
    /* 最後の行まで先に並べて(見えない状態で)場所を確保し、順に見せる。枠の大きさは変わらない */
    var logs=['プロフィールを読み込み','制作物を読み込み','リンクを確認'];
    var rows=logs.map(function(l){return el('r hid','<span><span class="dim">[build]</span> '+l+'</span><span class="pr">ok</span>');});
    var blank=el('hid','&nbsp;');
    var aff=el('hid','<span class="dim">&gt;</span> 公立はこだて未来大学 3年');
    var nm=el('oname hid','永田 來煉');
    var ex=el('hid','<span class="dim">exit status 0</span>');
    rows.concat([blank,aff,nm,ex]).forEach(function(e){t.appendChild(e);});
    function show(e){e.classList.remove('hid');e.classList.add('fi');}
    await sleep(500); if(!alive())return false;
    if(!await typeInto(p.querySelector('#cmd'),'go run main.go',70,alive))return false;
    await sleep(350); if(!alive())return false;
    p.querySelector('.caret').remove();
    for(var i=0;i<rows.length;i++){ show(rows[i]); await sleep(420); if(!alive())return false; }
    await sleep(200); if(!alive())return false;
    show(aff);
    await sleep(350); if(!alive())return false;
    show(nm);
    await sleep(500); if(!alive())return false;
    show(ex);
    await sleep(700);
    return alive();
  }
  function start(){
    var id=++run;
    scene.innerHTML=''; clearHint();
    skipBtn.hidden=false; nav.setAttribute('inert','');
    root.classList.remove('noi'); root.classList.add('playing');
    fit(); window.scrollTo(0,0);
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
})();
