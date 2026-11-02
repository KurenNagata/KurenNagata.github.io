const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   函館の夜景（canvas）
   街の灯りが左から順に灯り、沖では漁火がゆっくり動く
   ========================================================= */
(function harbor(){
  const cv = document.getElementById("harbor");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  let W, H, horizon, shore, city = [], boats = [], stars = [], mountain = [], ropeway = [];
  let running = false, start = performance.now(), raf;

  const rand = (a, b) => a + Math.random() * (b - a);

  function build(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const landH = Math.max(110, Math.min(170, H * 0.17));
    shore = H - landH;
    horizon = shore - Math.max(34, H * 0.045);

    // 星
    stars = Array.from({ length: Math.round(W / 9) }, () => ({
      x: rand(0, W), y: rand(0, horizon * 0.75), r: rand(.4, 1.2), ph: rand(0, 6.28), sp: rand(.6, 1.8)
    }));

    // 函館山のシルエット（右側）
    // なだらかで横に長い山。左に主峰、右へ低い峰が続く
    const mx = W * (W < 700 ? 0.6 : 0.72), mw = W * (W < 700 ? 0.8 : 0.52), mh = Math.min(120, H * 0.14);
    mountain = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = mx - mw / 2 + mw * t;
      const edge = Math.pow(Math.sin(Math.PI * t), 0.55);
      const peaks = 0.78 * Math.exp(-Math.pow((t - 0.36) / 0.2, 2)) + 0.5 * Math.exp(-Math.pow((t - 0.66) / 0.16, 2)) + 0.18;
      const bump = Math.min(1, edge * peaks + 0.02 * Math.sin(t * 40));
      mountain.push([x, horizon - mh * Math.max(0, bump)]);
    }
    // 山頂へ向かう灯り
    ropeway = Array.from({ length: 9 }, (_, i) => {
      const p = mountain[12 + i * 1];
      return { x: p[0], y: p[1] + rand(14, 26), ph: rand(0, 6.28) };
    });

    // 沖の漁火
    boats = Array.from({ length: Math.max(6, Math.round(W / 140)) }, () => ({
      x: rand(0, W), y: rand(horizon + 4, shore - 8), r: rand(1.4, 2.4), v: rand(2, 7) * (Math.random() < .5 ? -1 : 1), ph: rand(0, 6.28)
    }));

    // 街の灯り
    const palette = ["#FFD27A", "#FFE9B8", "#FFF6E0", "#FFC15A", "#9FD8FF"];
    const n = Math.round(W * 0.9);
    city = Array.from({ length: n }, () => {
      const x = rand(0, W);
      const depth = Math.pow(Math.random(), 1.7);
      const y = shore + 4 + depth * (H - shore - 4);
      return {
        x, y,
        s: 0.7 + depth * 1.4,
        c: palette[Math.random() < .08 ? 4 : Math.floor(Math.random() * 4)],
        a: rand(.45, 1),
        ph: rand(0, 6.28),
        sp: rand(.5, 2.4),
        on: (x / W) * 1400 + rand(0, 700),
        glow: Math.random() < .12
      };
    });
  }

  function draw(now){
    const t = (now - start) / 1000;
    const el = now - start;
    ctx.clearRect(0, 0, W, H);

    // 星
    for (const s of stars) {
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * s.sp + s.ph);
      ctx.fillStyle = "#DCE9F2";
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    ctx.globalAlpha = 1;

    // 地平線のにじみ
    const haze = ctx.createLinearGradient(0, horizon - 120, 0, horizon + 10);
    haze.addColorStop(0, "rgba(242,194,48,0)");
    haze.addColorStop(1, "rgba(242,194,48,.10)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - 120, W, 130);

    // 山
    ctx.beginPath();
    ctx.moveTo(mountain[0][0], horizon);
    for (const p of mountain) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(mountain[mountain.length - 1][0], horizon);
    ctx.closePath();
    ctx.fillStyle = "#040B13";
    ctx.fill();
    ctx.strokeStyle = "rgba(157,180,194,.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
    for (const r of ropeway) {
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 1.3 + r.ph);
      ctx.fillStyle = "#FFE9B8";
      ctx.fillRect(r.x, r.y, 1.6, 1.6);
    }
    ctx.globalAlpha = 1;

    // 海
    const sea = ctx.createLinearGradient(0, horizon, 0, shore);
    sea.addColorStop(0, "#0A2236");
    sea.addColorStop(1, "#061524");
    ctx.fillStyle = sea;
    ctx.fillRect(0, horizon, W, shore - horizon);

    // 漁火
    for (const b of boats) {
      if (!reduce) { b.x += b.v / 60; if (b.x < -20) b.x = W + 20; if (b.x > W + 20) b.x = -20; }
      const fl = 0.85 + 0.15 * Math.sin(t * 3 + b.ph);
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 16);
      g.addColorStop(0, `rgba(242,194,48,${.55 * fl})`);
      g.addColorStop(1, "rgba(242,194,48,0)");
      ctx.fillStyle = g;
      ctx.fillRect(b.x - 16, b.y - 16, 32, 32);
      ctx.fillStyle = `rgba(255,236,170,${fl})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.29); ctx.fill();
      // 水面の映り込み
      ctx.fillStyle = `rgba(242,194,48,${.18 * fl})`;
      ctx.fillRect(b.x - .6, b.y + 3, 1.2, Math.min(14, shore - b.y));
    }

    // 陸
    const land = ctx.createLinearGradient(0, shore, 0, H);
    land.addColorStop(0, "#050E18");
    land.addColorStop(1, "#02070D");
    ctx.fillStyle = land;
    ctx.fillRect(0, shore, W, H - shore);

    // 街の灯り
    for (const c of city) {
      const k = reduce ? 1 : Math.min(1, Math.max(0, (el - c.on) / 450));
      if (k <= 0) continue;
      const a = c.a * k * (0.75 + 0.25 * Math.sin(t * c.sp + c.ph));
      if (c.glow) {
        ctx.globalAlpha = a * .25;
        ctx.fillStyle = c.c;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.s * 3.2, 0, 6.29); ctx.fill();
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = c.c;
      ctx.fillRect(c.x, c.y, c.s, c.s);
    }
    ctx.globalAlpha = 1;
  }

  function loop(now){ draw(now); if (running) raf = requestAnimationFrame(loop); }
  function play(){ if (running || reduce) return; running = true; raf = requestAnimationFrame(loop); }
  function stop(){ running = false; cancelAnimationFrame(raf); }

  build();
  if (reduce) draw(performance.now() + 99999);
  else play();

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); start = performance.now() - 5000; if (reduce) draw(performance.now() + 99999); }, 150); });

  const band = document.querySelector(".hero-band");
  if ("IntersectionObserver" in window && band) {
    new IntersectionObserver(([e]) => { e.isIntersecting ? play() : stop(); }).observe(band);
  }
  document.addEventListener("visibilitychange", () => { document.hidden ? stop() : play(); });

  // マウスに合わせて光が動く
  const spot = document.getElementById("spot");
  if (band && spot && !reduce && matchMedia("(hover:hover)").matches) {
    band.addEventListener("pointermove", e => {
      const r = band.getBoundingClientRect();
      spot.style.setProperty("--mx", (e.clientX - r.left) + "px");
      spot.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }
})();

/* =========================================================
   読み込み時：GET /kuren を打ち込む → 見出し・コンソールが登場
   ========================================================= */
const typedEl = document.getElementById("reqTyped");
function typeRequest(){
  if (!typedEl || reduce) return;
  const parts = [["GET", "m-get"], [" /kuren", null]];
  typedEl.textContent = "";
  let pi = 0, ci = 0, span = null;
  (function tick(){
    if (pi >= parts.length) return;
    const [text, cls] = parts[pi];
    if (ci === 0) { span = document.createElement("span"); if (cls) span.className = cls; typedEl.appendChild(span); }
    span.textContent += text[ci++];
    if (ci >= text.length) { pi++; ci = 0; }
    setTimeout(tick, 70 + Math.random() * 60);
  })();
}
if (typedEl && !reduce) typedEl.textContent = "";
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.body.classList.add("ready");
  setTimeout(typeRequest, 350);
}));

/* =========================================================
   API コンソール
   ========================================================= */
const responses = {
  profile: {
    name: "永田 來煉 / Nagata Kuren",
    school: "公立はこだて未来大学 情報アーキテクチャ学科 高度ICTコース 3年",
    focus: "backend (Go)",
    location: "Hakodate, JP",
    open_to_work: true
  },
  now: {
    shabet: "12人チームのリーダー。11月にMVP、12月にストア公開予定",
    funavi: "生協食堂の混雑を予測するテーマを3人で立ち上げ中",
    hope_notifier: "課題の締切を Discord に通知。サーバーで毎日稼働中"
  },
  stack: {
    backend: ["Go", "TypeSpec / OpenAPI", "PostgreSQL"],
    infra: ["Docker", "Linux (Debian)", "Cloudflare Workers"],
    app: ["Flutter", "React"],
    team: ["スクラム", "コードレビュー", "Notion"]
  }
};

function tokenize(obj){
  const out = [];
  const push = (t, c) => out.push([t, c || null]);
  const keys = Object.keys(obj);
  push("{", "p"); push("\n");
  keys.forEach((k, i) => {
    push("  "); push('"' + k + '"', "k"); push(":", "p"); push(" ");
    const v = obj[k];
    if (Array.isArray(v)) {
      push("[", "p");
      v.forEach((item, j) => { push('"' + item + '"', "s"); if (j < v.length - 1) push(", ", "p"); });
      push("]", "p");
    } else if (typeof v === "string") push('"' + v + '"', "s");
    else push(String(v), "n");
    if (i < keys.length - 1) push(",", "p");
    push("\n");
  });
  push("}", "p");
  return out;
}

const body = document.getElementById("consoleBody");
const msEl = document.getElementById("ms");
const tabs = [...document.querySelectorAll(".req")];
let timers = [];

function renderAll(tokens){
  body.textContent = "";
  tokens.forEach(([t, c]) => {
    if (c) { const s = document.createElement("span"); s.className = c; s.textContent = t; body.appendChild(s); }
    else body.appendChild(document.createTextNode(t));
  });
}

function stream(key){
  timers.forEach(clearTimeout); timers = [];
  const tokens = tokenize(responses[key]);
  if (msEl) msEl.textContent = (8 + Math.floor(Math.random() * 18)) + "ms";
  if (reduce) { renderAll(tokens); return; }
  body.textContent = "";
  const caret = document.createElement("span"); caret.className = "caret";
  body.appendChild(caret);
  let ti = 0, ci = 0, span = null;
  (function tick(){
    if (ti >= tokens.length) return;
    const [text, cls] = tokens[ti];
    if (ci === 0) { span = cls ? document.createElement("span") : null; if (span) { span.className = cls; body.insertBefore(span, caret); } }
    const ch = text[ci++];
    if (span) span.textContent += ch; else body.insertBefore(document.createTextNode(ch), caret);
    if (ci >= text.length) { ti++; ci = 0; }
    timers.push(setTimeout(tick, ch === "\n" ? 70 : 10 + Math.random() * 22));
  })();
}

function select(tab, focus){
  tabs.forEach(t => { const on = t === tab; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
  if (focus) tab.focus();
  stream(tab.dataset.req);
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
  });
});
if (body && tabs.length) {
  tabs.forEach((t, i) => t.tabIndex = i === 0 ? 0 : -1);
  setTimeout(() => stream("profile"), reduce ? 0 : 1700);
}

/* =========================================================
   流れる技術名：途切れないように中身を2倍にする
   ========================================================= */
const track = document.getElementById("tickerTrack");
if (track && !reduce) track.innerHTML += track.innerHTML;

/* =========================================================
   スクロール：登場アニメーション・見出しの打ち込み・現在地
   ========================================================= */
function typePath(el){
  const full = el.dataset.type;
  if (!full || reduce) return;
  el.textContent = "";
  let i = 0;
  (function tick(){ el.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(tick, 55); })();
}

const rvItems = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      const p = en.target.querySelector(".path[data-type]");
      if (p) typePath(p);
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  rvItems.forEach(el => io.observe(el));
} else {
  rvItems.forEach(el => el.classList.add("in"));
}

const head = document.getElementById("siteHead");
const band = document.querySelector(".hero-band");
const navLinks = [...document.querySelectorAll(".routes a")];
const bar = document.getElementById("progressBar");

if ("IntersectionObserver" in window) {
  if (head && band) {
    new IntersectionObserver(([e]) => head.classList.toggle("over", e.isIntersecting), { rootMargin: "-64px 0px 0px 0px", threshold: 0 })
      .observe(band);
  }
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main .sec[id]").forEach(s => spy.observe(s));
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  });
}, { passive: true });

/* =========================================================
   #works/xxx で該当の制作物を開く
   ========================================================= */
function openFromHash(){
  const m = location.hash.match(/^#works\/([\w-]+)/);
  if (!m) return;
  const target = [...document.querySelectorAll(".ep-path")].find(p => p.textContent.trim().endsWith("/works/" + m[1]));
  if (target) { const d = target.closest("details"); d.open = true; d.scrollIntoView({ block: "start" }); }
}
window.addEventListener("hashchange", openFromHash);
openFromHash();

/* =========================================================
   メールアドレスをコピー
   ========================================================= */
const copyBtn = document.getElementById("copyMail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.mail);
      copyBtn.textContent = "コピーしました";
      copyBtn.classList.add("done");
      setTimeout(() => { copyBtn.textContent = "アドレスをコピー"; copyBtn.classList.remove("done"); }, 2000);
    } catch (e) {
      copyBtn.textContent = "コピーできませんでした";
    }
  });
}

/* =========================================================
   テーマ切り替え
   ========================================================= */
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}
