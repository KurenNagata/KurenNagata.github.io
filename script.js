const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tabs = [...document.querySelectorAll(".tab")];
const navLinks = [...document.querySelectorAll(".gnav nav a")];
const titles = { home: "永田來煉 | ポートフォリオ", works: "制作物 | 永田來煉", skills: "技術 | 永田來煉", history: "経歴 | 永田來煉", contact: "連絡先 | 永田來煉" };

/* スクロールしたときの登場 */
let io = null;
if ("IntersectionObserver" in window && !reduce) {
  io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
}
function watch(tab){
  tab.querySelectorAll(".rv").forEach(el => {
    el.classList.remove("in");
    if (io) io.observe(el); else el.classList.add("in");
  });
}

/* タブの切り替え（#works や #works/shabet の形） */
function show(){
  const [name, item] = (location.hash.slice(1) || "home").split("/");
  const target = tabs.find(t => t.dataset.tab === name) ? name : "home";
  tabs.forEach(t => { t.hidden = t.dataset.tab !== target; });
  navLinks.forEach(a => {
    if (a.dataset.tab === target) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = titles[target];
  const tab = tabs.find(t => t.dataset.tab === target);
  watch(tab);
  if (item) {
    const d = document.getElementById("w-" + item);
    if (d) { d.open = true; requestAnimationFrame(() => d.scrollIntoView({ block: "center" })); return; }
  }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", show);
show();

/* メールアドレスをコピー */
const copyBtn = document.getElementById("copyMail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("b1024162@fun.ac.jp");
      copyBtn.textContent = "コピーしました";
    } catch (e) {
      copyBtn.textContent = "コピーできませんでした";
    }
    setTimeout(() => { copyBtn.textContent = "コピー"; }, 2000);
  });
}
