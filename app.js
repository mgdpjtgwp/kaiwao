// 1) ナビのactive表示（ファイル名で判定）
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('[data-nav]').forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });
})();

// 2) indexの検索フィルター（data-filterを持つカードに対応）
(() => {
  const input = document.querySelector('[data-search]');
  if (!input) return;
  const cards = Array.from(document.querySelectorAll('[data-filter]'));
  const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g," ").trim();

  const apply = () => {
    const q = normalize(input.value);
    cards.forEach(el => {
      const hay = normalize(el.getAttribute('data-filter'));
      el.style.display = (q === "" || hay.includes(q)) ? "" : "none";
    });
  };
  input.addEventListener("input", apply);
  apply();
})();

// 3) コピーボタン（data-copy-target="#id"）
async function copyText(text){
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch(e) {}
  document.body.removeChild(ta);
}

(() => {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sel = btn.getAttribute('data-copy-target');
      const el = document.querySelector(sel);
      const text = el ? el.innerText.trim() : '';
      if (!text) return;

      const old = btn.textContent;
      btn.textContent = "コピーした";
      btn.disabled = true;

      await copyText(text);
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 900);
    });
  });
})();

// 4) 目次：.section 内の h2/h3 を拾って #toc に出す（存在すれば）
(() => {
  const toc = document.getElementById("toc");
  if (!toc) return;

  const headings = Array.from(document.querySelectorAll(".section h2, .section h3"));
  const list = document.createElement("div");

  headings.forEach((h, i) => {
    if (!h.id) h.id = "h-" + i;
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.className = "small";
    a.textContent = (h.tagName === "H3" ? "  └ " : "• ") + h.textContent;
    list.appendChild(a);
  });

  toc.appendChild(list);
})();
