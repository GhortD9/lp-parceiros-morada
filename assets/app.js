(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const P = Object.fromEntries(PARTNERS.map(p => [p.slug, p]));
  const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  const logo = p => `assets/logos/${p.logo}.png`;
  /* tamanho óptico: logo quadrado e logo largo com o mesmo peso visual (ver .lg no CSS) */
  const fit = name => { const m = (window.LOGO_AR || {})[name] || { ar: 2, d: .3 };
    return { ar: m.ar, k: (Math.pow(m.ar, -.5) * Math.pow(.3 / Math.max(m.d, .08), .12)).toFixed(3) }; };
  const lg = (p, alt = "", lazy = true) => { const f = fit(p.logo);
    return `<img class="lg" src="${logo(p)}" alt="${alt}" style="--ar:${f.ar};--k:${f.k}"${lazy ? ' loading="lazy"' : ""}>`; };
  const setFit = (img, name) => { const f = fit(name); img.style.setProperty("--ar", f.ar); img.style.setProperty("--k", f.k); };
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));


  /* ---------- texto em palavras (split) ---------- */
  $$("[data-split]").forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = t; s.style.setProperty("--i", i++);
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  });

  /* ---------- marquee ---------- */
  const order = ["cv-crm","sienge","facilita-crm","dommus","senior-sistemas","resolutpay","studio-61","vmv-group","play","atta-3d","multidados",
                 "psa-sistemas","solomo","imovel-p","squad-realty","pzr-sistemas","skyline-ip","cub","upload","facilitat","delta3-solucoes","arquiteto-de-bolso"];
  {
    const html = order.map(s => `<div class="plate">${lg(P[s], esc(P[s].name), false)}</div>`).join("");
    $(".marquee__track").innerHTML = html + html.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');
  }

  setFit($(".meta__badge img"), "meta-business-partner");

  /* ---------- jornada ---------- */
  const mini = s => `<button class="mini" data-open="${s}" aria-label="${esc(P[s].name)}: ver detalhes">${lg(P[s])}</button>`;
  $("#steps").innerHTML = JOURNEY.map((j, k) => `
    <article class="step${k === 0 ? " is-on" : ""}" data-step="${k}">
      <figure class="step__img"><img src="assets/img/${j.img}.jpg" alt="" loading="lazy"></figure>
      <p class="step__tag"><b>${j.n}</b><span></span>${j.tag}</p>
      <p class="step__product">Com a <strong>${j.product}</strong></p>
      <h3 class="step__title">${j.title}</h3>
      <p class="step__text">${j.text}</p>
      <ul class="caps">${j.caps.map(c => `<li>${check}${c}</li>`).join("")}</ul>
      <p class="who">Parceiros nesta etapa</p>
      <div class="minis">${j.partners.map(mini).join("")}</div>
    </article>`).join("");
  $("#base-logos").innerHTML = PARTNERS.filter(p => p.stage === "base").map(p => mini(p.slug)).join("");

  const steps = $$(".step"), stageImgs = $$(".stage__img"), chipN = $(".stage__n"), chipP = $(".stage__p"), rail = $(".stage__rail i");
  let curStep = 0;
  const setStep = k => {
    if (k === curStep) return;
    curStep = k;
    steps.forEach((s, i) => s.classList.toggle("is-on", i === k));
    stageImgs.forEach((f, i) => { f.classList.toggle("is-on", i === k); f.classList.toggle("is-past", i < k); });
    chipN.textContent = JOURNEY[k].n;
    chipP.textContent = `${JOURNEY[k].product} · ${JOURNEY[k].tag.toLowerCase()}`;
  };

  /* ---------- integrações ---------- */
  const tabs = $("#integ-tabs"), body = $("#integ-body");
  tabs.innerHTML = INTEGRATIONS.map((g, i) => {
    const n = g.modules.reduce((a, m) => a + m.items.length, 0);
    return `<button class="tab" role="tab" id="tab-${g.slug}" aria-controls="integ-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
      <span class="tab__plate">${lg(P[g.slug], "", false)}</span>
      <span><span class="tab__name">${g.name}</span><span class="tab__mods">${g.modules.map(m => m.id).join(" · ")}</span></span>
      <span class="tab__n">${n}</span></button>`;
  }).join("");
  const showInteg = i => {
    const g = INTEGRATIONS[i], p = P[g.slug];
    $$(".tab", tabs).forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
    $("#integ-panel").setAttribute("aria-labelledby", `tab-${g.slug}`);
    const img = $("#integ-logo"); img.style.opacity = 0;
    setTimeout(() => { img.src = logo(p); img.alt = p.name; setFit(img, p.logo); img.style.opacity = 1; }, reduce ? 0 : 160);
    let n = 0;
    body.innerHTML = g.modules.map(m => `
      <div class="mod">
        <p class="mod__head"><span class="mod__name">${m.id}</span><span class="mod__role">${m.role}</span></p>
        <ul class="feats">${m.items.map(([t, d]) => `<li class="feat" style="--i:${n++}"><h4>${t}</h4><p>${d}</p></li>`).join("")}</ul>
        ${m.items.length > 4 ? `<button class="more" type="button">Ver todas as ${m.items.length}</button>` : ""}
      </div>`).join("");
    $$(".mod", body).forEach(m => { if ($(".more", m)) m.classList.add("is-clamped"); });
    const total = g.modules.reduce((a, m) => a + m.items.length, 0);
    $("#integ-sum").textContent = `${total} funcionalidades conectando a Morada.ai ao ${g.name}.`;
    const cta = $("#integ-cta"); cta.href = "#contato"; cta.dataset.form = "contato"; cta.dataset.partner = g.slug;
    cta.firstChild.textContent = `Falar com especialista ${g.name} `;
  };
  body.addEventListener("click", e => { const b = e.target.closest(".more"); if (b) b.closest(".mod").classList.remove("is-clamped"); });
  tabs.addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) showInteg(+t.dataset.i); });
  tabs.addEventListener("keydown", e => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault();
    const cur = $$(".tab", tabs).findIndex(t => t.getAttribute("aria-selected") === "true");
    const nx = (cur + k + INTEGRATIONS.length) % INTEGRATIONS.length;
    showInteg(nx); $$(".tab", tabs)[nx].focus();
  });
  showInteg(0);
  const panel = $("#integ-panel");
  panel.addEventListener("pointermove", e => { const r = panel.getBoundingClientRect(); panel.style.setProperty("--mx", `${e.clientX - r.left}px`); });

  /* ---------- diretório ---------- */
  const grid = $("#grid"), chips = $("#chips"), q = $("#q");
  let cat = "all";
  grid.innerHTML = PARTNERS.map(p => `
    <li class="card" data-slug="${p.slug}" data-cat="${p.cat}">
      <button class="card__btn" data-open="${p.slug}">
        <span class="card__plate">${lg(p)}</span>
        <span class="card__top"><span class="card__name">${p.name}</span>${p.integ ? '<span class="badge">Integração nativa</span>' : ""}</span>
        <span class="card__short">${p.short}</span>
        <span class="card__foot"><span>${CAT[p.cat]}</span><span class="card__go"><i class="arr"></i></span></span>
      </button>
    </li>`).join("");
  const count = c => PARTNERS.filter(p => c === "all" || p.cat === c).length;
  chips.innerHTML = [{ id: "all", label: "Todos" }, ...CATEGORIES].map(c =>
    `<button class="chip" data-cat="${c.id}" aria-pressed="${c.id === "all"}">${c.label} <small>${count(c.id)}</small></button>`).join("");
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const cards = $$(".card", grid);
  const applyFilter = () => {
    const term = norm(q.value.trim());
    const first = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    let shown = 0;
    cards.forEach(c => {
      const p = P[c.dataset.slug];
      const ok = (cat === "all" || p.cat === cat) && (!term || norm(`${p.name} ${p.short} ${p.long} ${CAT[p.cat]}`).includes(term));
      c.hidden = !ok; if (ok) shown++;
    });
    $("#count").textContent = shown === PARTNERS.length ? `${shown} parceiros` : `${shown} de ${PARTNERS.length} parceiros`;
    $("#empty").hidden = shown > 0;
    if (reduce) return;
    cards.filter(c => !c.hidden).forEach((c, i) => {
      const a = first.get(c), b = c.getBoundingClientRect();
      if (a) {
        const dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" });
      } else {
        c.animate([{ opacity: 0, transform: "translateY(16px) scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: Math.min(i, 10) * 35, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      }
    });
  };
  chips.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.cat;
    $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", c === b));
    applyFilter();
  });
  let qt; q.addEventListener("input", () => { clearTimeout(qt); qt = setTimeout(applyFilter, 120); });
  $("#clear").addEventListener("click", () => { q.value = ""; cat = "all"; $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === "all")); applyFilter(); });
  addEventListener("keydown", e => {
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); $("#diretorio").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); setTimeout(() => q.focus({ preventScroll: true }), reduce ? 0 : 500); }
  });
  applyFilter();

  /* ---------- drawer ---------- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  let lastFocus = null;
  const openDrawer = slug => {
    const p = P[slug]; if (!p) return;
    lastFocus = document.activeElement;
    $("#dr-logo").src = logo(p); $("#dr-logo").alt = p.name; setFit($("#dr-logo"), p.logo);
    $("#dr-cat").textContent = CAT[p.cat];
    $("#dr-name").textContent = p.name;
    $("#dr-short").textContent = p.short;
    $("#dr-long").textContent = p.long !== p.short ? p.long : "";
    $("#dr-long").hidden = p.long === p.short;
    $("#dr-stage").textContent = STAGES[p.stage];
    $("#dr-int").textContent = p.integ ? "Nativa com a Morada.ai" : "Parceria oficial";
    const cta = $("#dr-cta"); cta.href = "#contato"; cta.dataset.form = "contato"; cta.dataset.partner = p.slug;
    const ib = $("#dr-integ"); ib.hidden = !p.integ; ib.dataset.slug = p.slug;
    drawer.hidden = scrim.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add("is-open"); scrim.classList.add("is-open"); }));
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => $("#dr-close").focus(), 50);
  };
  const closeDrawer = () => {
    drawer.classList.remove("is-open"); scrim.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    setTimeout(() => { drawer.hidden = scrim.hidden = true; }, reduce ? 0 : 600);
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  document.addEventListener("click", e => { const o = e.target.closest("[data-open]"); if (o) openDrawer(o.dataset.open); });
  $("#dr-close").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  $("#dr-integ").addEventListener("click", e => {
    const i = INTEGRATIONS.findIndex(g => g.slug === e.currentTarget.dataset.slug);
    closeDrawer(); if (i >= 0) showInteg(i);
  });
  addEventListener("keydown", e => {
    if (drawer.hidden) return;
    if (e.key === "Escape") closeDrawer();
    if (e.key === "Tab") {
      const f = $$("a[href]:not([hidden]),button:not([hidden])", drawer).filter(x => x.offsetParent);
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- menu mobile ---------- */
  const burger = $(".nav__burger"), menu = $("#menu");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open); menu.hidden = !open;
    $("#nav").classList.toggle("is-scrolled", open || scrollY > 30);
  });
  menu.addEventListener("click", e => { if (e.target.closest("a")) { burger.setAttribute("aria-expanded", false); menu.hidden = true; } });

  /* ---------- feed do hero ---------- */
  const feed = $("#feed");
  let fi = 0;
  const pushEv = () => {
    const ev = FEED[fi++ % FEED.length];
    const li = document.createElement("li"); li.className = "ev";
    li.innerHTML = `<span class="ev__av" data-p="${ev.who}">${ev.who}</span><div><p class="ev__t">${ev.what}</p><p class="ev__s"><b>${ev.where}</b><i></i>${ev.did}</p></div>`;
    feed.prepend(li);
    const items = $$(".ev", feed);
    if (items.length > 3) { const old = items[items.length - 1]; old.classList.add("is-out"); setTimeout(() => old.remove(), 600); }
  };
  if (getComputedStyle($(".feed")).display !== "none") {
    pushEv(); setTimeout(pushEv, 500); setTimeout(pushEv, 1000);
    if (!reduce) setInterval(() => { if (heroVisible && !document.hidden) pushEv(); }, 2800);
  }

  /* ---------- rede no hero (canvas) ---------- */
  let heroVisible = true;
  const cv = $("#net"), ctx = cv.getContext("2d");
  let W, H, pts = [], dpr = Math.min(devicePixelRatio || 1, 2);
  const sizeNet = () => {
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, W * H / 22000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W * .62, y: Math.random() * H * .78, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() * 1.3 + .4 }));
  };
  const pulses = [];
  const drawNet = () => {
    ctx.clearRect(0, 0, W, H);
    const maxD = 140;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W * .62) p.vx *= -1;
      if (p.y < 0 || p.y > H * .78) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < maxD) {
        const fade = 1 - (a.x + b.x) / 2 / (W * .62);
        ctx.strokeStyle = `rgba(96,170,255,${(1 - d / maxD) * .22 * Math.max(.15, 1 - fade * .6)})`;
        ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    for (const p of pts) { ctx.fillStyle = "rgba(170,210,255,.55)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    if (Math.random() < .04 && pts.length > 2) {
      const a = pts[Math.random() * pts.length | 0];
      const near = pts.filter(b => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < maxD);
      if (near.length) pulses.push({ a, b: near[Math.random() * near.length | 0], t: 0 });
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const s = pulses[i]; s.t += .02;
      if (s.t >= 1) { pulses.splice(i, 1); continue; }
      const x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 8); g.addColorStop(0, "rgba(2,207,255,.9)"); g.addColorStop(1, "rgba(2,207,255,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill();
    }
  };
  if (!reduce) {
    sizeNet(); addEventListener("resize", sizeNet);
    const loop = () => { if (heroVisible && !document.hidden) drawNet(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  /* ---------- contadores ---------- */
  const countUp = el => {
    const to = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), dur = 1400;
    const tick = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(tick); };
    el.textContent = "0"; requestAnimationFrame(tick);
  };

  /* ---------- scroll: reveal, nav, jornada, parallax ---------- */
  const nav = $("#nav"), hero = $(".hero"), heroImg = $(".hero__img"), joinImg = $(".join__media img"), join = $(".join");
  const filters = $("#filters");
  const reveals = $$(".reveal, [data-split]").filter(el => !el.closest(".hero"));
  const lightSecs = $$("[data-nav='light']");
  const navLinks = $$(".nav__links a");
  const secs = navLinks.map(a => $(a.getAttribute("href")));
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("is-scrolled", y > 30 || !menu.hidden);
    nav.classList.toggle("is-light", lightSecs.some(s => { const r = s.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40; }));
    const hr = hero.getBoundingClientRect(); heroVisible = hr.bottom > 0;
    if (!reduce && heroVisible) heroImg.style.translate = `0 ${y * .18}px`;
    if (!reduce) { const jr = join.getBoundingClientRect(); if (jr.bottom > 0 && jr.top < vh) joinImg.style.setProperty("--py", `${(jr.top + jr.height / 2 - vh / 2) * -.12}px`); }
    for (const el of reveals) if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < vh * .9) el.classList.add("is-in");
    // jornada
    if (steps.length && getComputedStyle(steps[0]).opacity !== undefined) {
      let best = 0, bd = Infinity;
      steps.forEach((s, i) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bd) { bd = d; best = i; } });
      setStep(best);
      const first = steps[0].getBoundingClientRect(), last = steps[steps.length - 1].getBoundingClientRect();
      const p = (vh / 2 - first.top) / (last.bottom - first.top);
      rail.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    }
    // filtros grudados
    filters.classList.toggle("is-stuck", filters.getBoundingClientRect().top <= parseFloat(getComputedStyle(filters).top) + 1 && $("#diretorio").getBoundingClientRect().bottom > 200);
    // link ativo
    let on = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * .4) on = i; });
    navLinks.forEach((a, i) => a.classList.toggle("is-on", i === on));
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- entrada ---------- */
  let started = false;
  const start = () => {
    if (started) return; started = true;
    document.body.classList.add("is-ready");
    $$(".hero .reveal, .hero [data-split]").forEach(el => el.classList.add("is-in"));
    $$("[data-count]").forEach(el => setTimeout(() => countUp(el), 900));
    onScroll();
  };
  if (heroImg.complete) requestAnimationFrame(start); else { heroImg.addEventListener("load", start, { once: true }); setTimeout(start, 1500); }
})();
