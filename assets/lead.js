/* LP Parceiros · Morada.ai — formulário → HubSpot
   Mesmo formato das LPs do CV e do Diagnóstico de IA:
   1. UTMs guardadas na chegada (sessão de 30 min) e enviadas nos campos morada_last_touch_*.
   2. Nome completo vira firstname + lastname (o CRM exige sobrenome).
   3. Parceiro de interesse vai no ponto de conversão: lp_parceiros_especialista_<parceiro>.
   4. Erro escrito no próprio campo; nada de balão do navegador.
   Configuração em data.js (LEAD_CONFIG). */
(() => {
  "use strict";
  const C = window.LEAD_CONFIG, d = document;
  const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isProd = C.HOSTS_PRODUCAO.test(location.hostname);
  const P = Object.fromEntries((window.PARTNERS || []).map(p => [p.slug, p]));

  /* ---------- tags (GTM + rastreio do HubSpot), só em *.morada.ai ---------- */
  window.dataLayer = window.dataLayer || [];
  if (isProd && C.GTM_ID && !d.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const g = d.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtm.js?id=" + C.GTM_ID; d.head.appendChild(g);
  }
  if (isProd && !d.getElementById("hs-script-loader")) {
    const h = d.createElement("script"); h.async = h.defer = true; h.id = "hs-script-loader"; h.src = "https://js.hs-scripts.com/" + C.HUBSPOT_PORTAL_ID + ".js"; d.body.appendChild(h);
  }
  const track = (event, p = {}) => window.dataLayer.push({ event, lp: "parceiros", ...p });

  /* ---------- UTMs ---------- */
  const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const EXTRA = ["channel", "conversion_point", "landing_url"];
  const KEYS = [...UTM, ...EXTRA, "referrer"], PFX = "morada_", TTL = 30 * 60 * 1000;
  let store = null;
  try { localStorage.setItem(PFX + "t", "1"); localStorage.removeItem(PFX + "t"); store = localStorage; } catch (e) {}
  const fromUrl = (q, k) => q.get("morada_last_touch_" + k) || (UTM.includes(k) ? q.get(k) : "") || "";
  const alive = () => { const ts = store && parseInt(store.getItem(PFX + "utm_ts") || "0", 10); return !!ts && Date.now() - ts <= TTL; };
  (() => {
    if (!store) return;
    const q = new URLSearchParams(location.search), got = {};
    let any = false;
    [...UTM, ...EXTRA].forEach(k => { const v = fromUrl(q, k); if (v) { got[k] = v; any = true; } });
    const external = d.referrer && d.referrer.indexOf(location.origin) !== 0;
    if (any || !alive()) {
      got.landing_url = got.landing_url || location.href.split("#")[0];
      got.referrer = external ? d.referrer : "";
      KEYS.forEach(k => got[k] ? store.setItem(PFX + k, got[k]) : store.removeItem(PFX + k));
    }
    store.setItem(PFX + "utm_ts", String(Date.now()));
  })();
  const utm = k => fromUrl(new URLSearchParams(location.search), k) || (store && alive() ? store.getItem(PFX + k) || "" : "");

  /* ---------- janela ---------- */
  const box = $("#lead"), scrim = $("#lead-scrim"), form = $("#lead-form"), done = $("#lead-done"), go = $("#lead-go");
  let mode = "contato", partner = "", lastFocus = null;

  const MODES = {
    contato: { eyebrow: "Falar com especialista", title: "Fale com um especialista", sub: "Conte rapidamente sobre a sua operação. Nosso time entra em contato.", btn: "Quero uma demonstração" },
    parceiro: { eyebrow: "Seja parceiro", title: "Quero ser parceiro", sub: "Conte sobre a sua empresa. Nosso time de parcerias entra em contato.", btn: "Enviar" }
  };
  const open = (m, slug) => {
    mode = m in MODES ? m : "contato"; partner = slug && P[slug] ? slug : "";
    const t = MODES[mode];
    $("#lead-eyebrow").textContent = partner ? `${P[partner].name} · especialista parceiro` : t.eyebrow;
    $("#lead-title").textContent = partner ? `Fale com um especialista em ${P[partner].name}` : t.title;
    $("#lead-sub").textContent = t.sub;
    go.innerHTML = `${t.btn} <i class="arr" aria-hidden="true"></i>`;
    form.hidden = false; done.hidden = true;
    lastFocus = d.activeElement;
    box.hidden = scrim.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => { box.classList.add("is-open"); scrim.classList.add("is-open"); }));
    d.documentElement.style.overflow = "hidden";
    setTimeout(() => $("#l-nome").focus({ preventScroll: true }), reduce ? 0 : 350);
    track("lp_parceiros_form_open", { tipo: mode, parceiro: partner });
  };
  const close = () => {
    box.classList.remove("is-open"); scrim.classList.remove("is-open");
    d.documentElement.style.overflow = "";
    setTimeout(() => { box.hidden = scrim.hidden = true; }, reduce ? 0 : 500);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };

  d.addEventListener("click", e => {
    const a = e.target.closest("[data-form]"); if (!a) return;
    e.preventDefault();
    const fromDrawer = a.closest("#drawer");
    if (fromDrawer) $("#dr-close").click();
    track("lp_parceiros_cta_click", { tipo: a.dataset.form, parceiro: a.dataset.partner || "" });
    setTimeout(() => open(a.dataset.form, a.dataset.partner), fromDrawer && !reduce ? 380 : 0);
  });
  $("#lead-close").addEventListener("click", close);
  $("#lead-ok").addEventListener("click", close);
  scrim.addEventListener("click", close);
  d.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const f = [...box.querySelectorAll("a[href],button,input,select")].filter(x => x.offsetParent && !x.disabled);
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  if (location.hash === "#contato") open("contato");
  if (location.hash === "#seja-parceiro-form") open("parceiro");

  /* ---------- campos ---------- */
  const tel = $("#l-tel");
  tel.addEventListener("input", () => {
    const v = tel.value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
    let o = v;
    if (v.length > 10) o = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 6) o = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    else if (v.length > 2) o = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length) o = `(${v}`;
    tel.value = o;
  });

  const fields = [...form.querySelectorAll("input[required], select[required]")];
  const boxOf = el => el.closest(".fld, .consent");
  const problem = el => {
    const v = el.value.trim();
    if (el.type === "checkbox") return el.checked ? "" : "Marque para enviar.";
    if (!v) return el.tagName === "SELECT" ? "Selecione uma opção." : "Preencha este campo.";
    if (el.id === "l-nome" && !/\S\s+\S/.test(v)) return "Informe nome e sobrenome.";
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Informe um e-mail válido.";
    if (el === tel && v.replace(/\D/g, "").length < 10) return "Informe o telefone com DDD.";
    return "";
  };
  const setError = (el, msg) => {
    const b = boxOf(el), id = el.id + "-erro";
    let p = d.getElementById(id);
    b.classList.toggle("is-invalid", !!msg);
    if (!msg) { el.removeAttribute("aria-invalid"); p && p.remove(); return; }
    el.setAttribute("aria-invalid", "true");
    if (!p) { p = d.createElement("p"); p.className = "fld__err"; p.id = id; p.setAttribute("role", "alert"); b.appendChild(p); el.setAttribute("aria-describedby", id); }
    p.textContent = msg;
  };
  let tried = false;
  fields.forEach(el => {
    el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input", () => { if (boxOf(el).classList.contains("is-invalid") && !problem(el)) setError(el, ""); });
    el.addEventListener("blur", () => { if (tried) setError(el, problem(el)); });
  });

  /* ---------- envio ---------- */
  const cookie = n => { const m = d.cookie.match("(^|;) ?" + n + "=([^;]*)(;|$)"); return m ? m[2] : null; };
  const ponto = () => mode === "parceiro" ? C.PONTO_SEJA_PARCEIRO : C.PONTO + (partner ? "_" + partner : "");
  const toHubSpot = () => {
    const nome = $("#l-nome").value.trim().replace(/\s+/g, " "), i = nome.indexOf(" ");
    const digits = tel.value.replace(/\D/g, "");
    const list = [
      { name: "firstname", value: i > 0 ? nome.slice(0, i) : nome },
      { name: "lastname", value: i > 0 ? nome.slice(i + 1) : "" },
      { name: "email", value: $("#l-email").value.trim() },
      { name: "phone", value: "+55 " + tel.value.trim() },
      { name: "company", value: $("#l-empresa").value.trim() },
      { name: "jobtitle", value: $("#l-cargo").value },
      { name: "tipo_da_empresa", value: $("#l-tipo").value },                       // valor interno exato do CRM
      { name: "morada_last_touch_channel", value: utm("channel") || C.CANAL },
      { name: "morada_last_touch_conversion_point", value: utm("conversion_point") && !partner && mode === "contato" ? utm("conversion_point") : ponto() },
      { name: "morada_last_touch_datetime", value: String(Date.now()) },            // datetime do CRM: milissegundos
      { name: "morada_last_touch_landing_url", value: utm("landing_url") || location.href.split("#")[0] },
      { name: "morada_last_touch_referrer", value: utm("referrer") }                // rótulo no HubSpot: "…utm_referrer"
    ];
    UTM.forEach(k => list.push({ name: "morada_last_touch_" + k, value: utm(k) }));
    if (!C.HUBSPOT_FORM_ID) {
      console.warn("[LP Parceiros] HUBSPOT_FORM_ID vazio: envio simulado, nenhum dado saiu da página.", list);
      return new Promise(r => setTimeout(() => r("simulado"), 600));
    }
    const ctl = window.AbortController ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), C.TIMEOUT);
    return fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${C.HUBSPOT_PORTAL_ID}/${C.HUBSPOT_FORM_ID}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({ submittedAt: Date.now(), fields: list, context: { hutk: cookie("hubspotutk") || undefined, pageUri: location.href, pageName: d.title } })
    }).then(r => r.ok ? "ok" : r.text().then(t => { console.error("[LP Parceiros] HubSpot recusou o envio", r.status, t); return "erro_" + r.status; }))
      .catch(err => { console.error("[LP Parceiros] HubSpot não respondeu", err); return "erro_rede"; })
      .then(s => { clearTimeout(timer); return s; });
  };

  // aviso por e-mail (Resend), em paralelo ao HubSpot
  const toEmail = () => {
    if (!C.EMAIL_ENDPOINT || location.protocol === "file:") return Promise.resolve("sem_endpoint");
    const body = {
      nome: $("#l-nome").value.trim(), email: $("#l-email").value.trim(), empresa: $("#l-empresa").value.trim(),
      cargo: $("#l-cargo").value, telefone: tel.value.trim(), tipoEmpresa: $("#l-tipo").value,
      partnerName: partner ? P[partner].name : (mode === "parceiro" ? "Quero ser parceiro" : ""),
      tipo: mode, ponto: ponto(), pagina: location.href.split("#")[0],
      utm: Object.fromEntries(UTM.map(k => [k, utm(k)]))
    };
    const ctl = window.AbortController ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), C.TIMEOUT);
    return fetch(C.EMAIL_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, signal: ctl ? ctl.signal : undefined, body: JSON.stringify(body) })
      .then(r => r.ok ? "ok" : r.text().then(t => { console.error("[LP Parceiros] e-mail recusado", r.status, t); return "erro_" + r.status; }))
      .catch(err => { console.error("[LP Parceiros] e-mail não respondeu", err); return "erro_rede"; })
      .then(s => { clearTimeout(timer); return s; });
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (go.disabled) return;
    tried = true;
    let bad = null;
    fields.forEach(el => { const m = problem(el); setError(el, m); if (m && !bad) bad = el; });
    let err = $("#lead-err"); err && err.remove();
    if (bad) { bad.focus(); track("lp_parceiros_form_invalido", { campo: bad.name }); return; }
    go.disabled = true; go.textContent = "Enviando…";
    const robo = !!$("#l-site").value;                                  // campo-isca preenchido: finge sucesso, não envia
    Promise.all(robo ? ["isca", "isca"] : [toHubSpot(), toEmail()]).then(([hs, mail]) => {
      const ok = s => s === "ok" || s === "simulado" || s === "isca";
      const status = ok(hs) || ok(mail) ? "ok" : hs;                    // basta um dos dois chegar
      track("lp_parceiros_lead", { hubspot: hs, email: mail, tipo: mode, parceiro: partner, ponto: ponto(), utm_source: utm("utm_source"), utm_medium: utm("utm_medium"), utm_campaign: utm("utm_campaign") });
      go.disabled = false; go.innerHTML = `${MODES[mode].btn} <i class="arr" aria-hidden="true"></i>`;
      if (status === "ok") {
        const nome = $("#l-nome").value.trim().split(" ")[0];
        $("#lead-done-t").textContent = `Recebemos, ${nome}.`;
        $("#lead-done-p").textContent = mode === "parceiro"
          ? "Nosso time de parcerias entra em contato pelo e-mail ou telefone que você deixou."
          : partner ? `Um especialista entra em contato para falar sobre a Morada.ai com ${P[partner].name}.`
          : "Um especialista entra em contato pelo e-mail ou telefone que você deixou.";
        form.reset(); tried = false;
        form.hidden = true; done.hidden = false; done.focus();
      } else {
        err = d.createElement("p"); err.id = "lead-err"; err.className = "lf__err"; err.setAttribute("role", "alert");
        err.textContent = "Não conseguimos enviar agora. Confira a conexão e tente de novo.";
        go.insertAdjacentElement("beforebegin", err);
      }
    });
  });
})();
