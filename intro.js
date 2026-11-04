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
    if(jump)window.scrollTo(0,intro.offsetHeight);
  }
  async function play(alive){
    var win=el('win','<div class="tb"><i></i><i></i><i></i><span>kuren — -zsh — 80×24</span></div>');
    var t=el('t'); win.appendChild(t); scene.appendChild(win);
    var p=el('','<span class="pr">kuren@mac</span> <span class="dim">~</span> % <span id="cmd"></span><span class="caret"></span>'); t.appendChild(p);
    /* 枠の大きさは固定。go run が依存パッケージを取得するときの出力が次々に流れ、あふれた分は上へ流れていく。止まったあとに名前が出る */
    var mods=['golang.org/x/sys v0.15.0','golang.org/x/text v0.14.0','golang.org/x/net v0.19.0','golang.org/x/crypto v0.16.0','golang.org/x/arch v0.6.0','github.com/gin-gonic/gin v1.9.1','github.com/gin-contrib/sse v0.1.0','github.com/go-playground/validator/v10 v10.16.0','github.com/go-playground/locales v0.14.1','github.com/go-playground/universal-translator v0.18.1','github.com/leodido/go-urn v1.2.4','github.com/gabriel-vasile/mimetype v1.4.3','github.com/pelletier/go-toml/v2 v2.1.0','github.com/ugorji/go/codec v1.2.11','github.com/bytedance/sonic v1.10.2','github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d','github.com/chenzhuoyu/iasm v0.9.1','github.com/twitchyliquid64/golang-asm v0.15.1','github.com/klauspost/cpuid/v2 v2.2.6','github.com/goccy/go-json v0.10.2','github.com/json-iterator/go v1.1.12','github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd','github.com/modern-go/reflect2 v1.0.2','github.com/mattn/go-isatty v0.0.20','google.golang.org/protobuf v1.31.0','gopkg.in/yaml.v3 v3.0.1','github.com/stretchr/testify v1.8.4','github.com/davecgh/go-spew v1.1.1','github.com/pmezard/go-difflib v1.0.0','github.com/jackc/pgx/v5 v5.5.0','github.com/jackc/pgpassfile v1.0.0','github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a','github.com/jackc/puddle/v2 v2.2.1','github.com/joho/godotenv v1.5.1','github.com/rs/zerolog v1.31.0','github.com/mattn/go-colorable v0.1.13','github.com/spf13/cobra v1.8.0','github.com/spf13/pflag v1.0.5','github.com/inconshreveable/mousetrap v1.1.0','github.com/google/uuid v1.4.0','github.com/golang-jwt/jwt/v5 v5.2.0','github.com/redis/go-redis/v9 v9.3.0','github.com/cespare/xxhash/v2 v2.2.0','github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f','go.uber.org/zap v1.26.0','go.uber.org/multierr v1.11.0','github.com/prometheus/client_golang v1.17.0','github.com/beorn7/perks v1.0.1','github.com/prometheus/common v0.45.0'];
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
