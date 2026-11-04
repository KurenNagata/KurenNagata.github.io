/* オープニング: ターミナルで go run main.go を実行して名前を出す。終わったら下にスクロールして本体へ */
(function(){
  var root=document.documentElement, intro=document.getElementById('intro');
  if(!intro||!root.classList.contains('playing'))return;
  var nav=document.querySelector('.gnav');
  function fit(){intro.style.height=Math.max(431,window.innerHeight-nav.offsetHeight)+'px';}
  fit(); window.addEventListener('resize',fit);
  nav.setAttribute('inert','');
  var scene=document.getElementById('scene'), skipBtn=document.getElementById('skip'), run=0;
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function el(c,h){var e=document.createElement('div');if(c)e.className=c;e.innerHTML=h||'';return e;}
  async function typeInto(n,t,ms,alive){for(var i=0;i<t.length;i++){if(!alive())return false;n.textContent+=t[i];await sleep(ms);}return true;}
  function seen(){try{sessionStorage.setItem('introSeen','1');}catch(e){}}
  function finish(jump){
    run++; seen(); skipBtn.hidden=true; nav.removeAttribute('inert');
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
    await sleep(500); if(!alive())return false;
    if(!await typeInto(p.querySelector('#cmd'),'go run main.go',70,alive))return false;
    await sleep(350); if(!alive())return false;
    p.querySelector('.caret').remove();
    var logs=['プロフィールを読み込み','制作物を読み込み','リンクを確認'];
    for(var i=0;i<logs.length;i++){
      t.appendChild(el('r fi','<span><span class="dim">[build]</span> '+logs[i]+'</span><span class="pr">ok</span>'));
      await sleep(420); if(!alive())return false;
    }
    t.appendChild(el('','&nbsp;')); await sleep(200);
    t.appendChild(el('fi','<span class="dim">&gt;</span> 公立はこだて未来大学 3年'));
    await sleep(350); if(!alive())return false;
    t.appendChild(el('oname fi','永田 來煉'));
    await sleep(500); if(!alive())return false;
    t.appendChild(el('fi','<span class="dim">exit status 0</span>'));
    await sleep(700);
    return alive();
  }
  skipBtn.addEventListener('click',function(){finish(true);});
  window.scrollTo(0,0);
  var id=++run;
  function go(){play(function(){return id===run;}).then(function(ok){if(ok)finish(false);});}
  if(document.visibilityState==='hidden'){document.addEventListener('visibilitychange',function o(){if(document.visibilityState==='visible'){document.removeEventListener('visibilitychange',o);go();}});}
  else go();
})();
