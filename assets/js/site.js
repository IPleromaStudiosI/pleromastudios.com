/* WORLDS: Anthropos — site script.
   ------------------------------------------------------------------
   SETTINGS YOU CAN CHANGE (Anthony): edit the values below and save.
   ------------------------------------------------------------------ */
const SITE = {
  // Newsletter: paste the form URL from Kit or MailerLite here once the account exists.
  // While it is empty, the form tells people signups open soon and points them to Discord.
  newsletterAction: "",
  newsletterEmailField: "email_address",
  discord: "https://discord.gg/MVRtM4kcHY",
  // Hero video: put a short looping .mp4 at assets/video/hero.mp4 and set this to true.
  heroVideo: false
};

(function () {
  "use strict";

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked — the page still works */ } }
  };

  /* ---------- mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- hero video (optional) ---------- */
  const heroMedia = document.querySelector(".hero-media");
  if (SITE.heroVideo && heroMedia && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const v = document.createElement("video");
    v.src = "assets/video/hero.mp4"; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute("aria-hidden", "true");
    const poster = heroMedia.querySelector("img");
    v.addEventListener("canplay", () => { if (poster) poster.remove(); heroMedia.prepend(v); }, { once: true });
    v.load();
  }

  /* ---------- toast ---------- */
  let toastEl;
  function toast(title, body) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = "";
    const b = document.createElement("b"); b.textContent = title; toastEl.appendChild(b);
    toastEl.appendChild(document.createTextNode(body));
    toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 5200);
  }

  /* ---------- newsletter ---------- */
  document.querySelectorAll("form.signup").forEach((form) => {
    const note = form.parentElement.querySelector(".form-note");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.querySelector("input[type=email]").value.trim();
      if (!email || !email.includes("@")) { note.textContent = "Enter an email address, like name@example.com."; return; }
      if (!SITE.newsletterAction) {
        note.innerHTML = "";
        note.append("Signups open soon. Until then, join us on ");
        const a = document.createElement("a"); a.href = SITE.discord; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Discord"; note.append(a, ".");
        return;
      }
      try {
        const body = new FormData(); body.append(SITE.newsletterEmailField, email);
        await fetch(SITE.newsletterAction, { method: "POST", body, mode: "no-cors" });
        note.textContent = "You're on the list. We'll write when there's something worth saying.";
        form.reset();
      } catch (err) {
        note.textContent = "That didn't go through. Check your connection and try again.";
      }
    });
  });

  /* ---------- copy buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      const done = () => { const o = btn.textContent; btn.textContent = "Copied"; setTimeout(() => (btn.textContent = o), 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => selectSibling(btn));
      } else selectSibling(btn);
    });
  });
  function selectSibling(btn) {
    const code = btn.parentElement.querySelector("code");
    if (!code) return;
    const r = document.createRange(); r.selectNodeContents(code);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  /* ---------- gallery viewer ---------- */
  document.querySelectorAll("[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = document.createElement("div");
      box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
      const img = document.createElement("img"); img.src = btn.getAttribute("data-full"); img.alt = btn.querySelector("img")?.alt || "";
      const close = document.createElement("button"); close.className = "btn btn-ghost"; close.textContent = "Close";
      box.append(img, close); document.body.appendChild(box); close.focus();
      const shut = () => { box.remove(); btn.focus(); document.removeEventListener("keydown", onKey); };
      const onKey = (ev) => { if (ev.key === "Escape") shut(); };
      close.addEventListener("click", shut);
      box.addEventListener("click", (ev) => { if (ev.target === box) shut(); });
      document.addEventListener("keydown", onKey);
    });
  });

  /* ---------- the Seal ----------
     Three Gatekeys are hidden on the site. Each one is remembered in this
     browser only. When all three are held, the footer Seal opens a hidden page. */
  const NUMERALS = { 1: "I", 2: "II", 3: "III" };
  function keys() { return store.get("worlds.gatekeys", []); }
  function renderSeal() {
    const held = keys();
    document.querySelectorAll(".seal-slots").forEach((s) => {
      const slots = s.querySelectorAll("i");
      slots.forEach((i, n) => i.classList.toggle("on", held.includes(n + 1)));
      const done = held.length >= 3;
      s.classList.toggle("complete", done);
      if (done) { s.setAttribute("href", "seal.html"); s.setAttribute("aria-label", "The Seal"); s.removeAttribute("aria-hidden"); s.tabIndex = 0; }
    });
    document.querySelectorAll(".gatekey").forEach((g) => {
      if (held.includes(Number(g.dataset.key))) g.classList.add("taken");
    });
  }
  window.WORLDS_takeKey = function (n) {
    const held = keys();
    if (!held.includes(n)) { held.push(n); store.set("worlds.gatekeys", held); }
    toast("GATEKEY — " + NUMERALS[n], held.length >= 3 ? "Three keys make one Seal." : "One of three. It does not say what it opens.");
    renderSeal();
  };
  document.querySelectorAll(".gatekey").forEach((g) => {
    g.addEventListener("click", () => window.WORLDS_takeKey(Number(g.dataset.key)));
  });
  renderSeal();

  /* the commanding officer's name is redacted. Mostly. */
  const co = document.querySelector("[data-redacted-co]");
  if (co) {
    let n = 0;
    co.addEventListener("click", () => {
      n += 1;
      if (n === 3 && !keys().includes(1)) window.WORLDS_takeKey(1);
    });
  }

  /* typing the name of the device anywhere calls it up */
  let typed = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-9);
    if (typed === "wayfinder") window.location.href = "wayfinder.html";
  });
})();
