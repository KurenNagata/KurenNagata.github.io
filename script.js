// ===== API コンソール：リクエストを選ぶとレスポンスが流れて表示される =====
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

// JSON を [文字列, クラス] の並びに変換
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
    } else if (typeof v === "string") {
      push('"' + v + '"', "s");
    } else {
      push(String(v), "n");
    }
    if (i < keys.length - 1) push(",", "p");
    push("\n");
  });
  push("}", "p");
  return out;
}

const body = document.getElementById("consoleBody");
const msEl = document.getElementById("ms");
const tabs = [...document.querySelectorAll(".req")];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    if (ti >= tokens.length) { timers.push(setTimeout(() => caret.remove(), 1200)); return; }
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
  setTimeout(() => stream("profile"), reduce ? 0 : 350);
}

// ===== ヘッダー：今見ているセクションを示す =====
const navLinks = [...document.querySelectorAll(".routes a")];
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main .sec[id]").forEach(s => io.observe(s));
}

// ===== URL の #works/xxx で該当の制作物を開く =====
function openFromHash(){
  const m = location.hash.match(/^#works\/([\w-]+)/);
  if (!m) return;
  const target = [...document.querySelectorAll(".ep-path")].find(p => p.textContent.trim().endsWith("/works/" + m[1]));
  if (target) { const d = target.closest("details"); d.open = true; d.scrollIntoView({ block: "start" }); }
}
window.addEventListener("hashchange", openFromHash);
openFromHash();

// ===== テーマ切り替え =====
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
