/* LP Parceiros · Morada.ai — aviso de lead por e-mail (Resend)
   Mesmo papel da rota /api/send-email da LP antiga do v0, como função da Vercel.
   Variáveis no projeto da Vercel (Settings → Environment Variables):
     RESEND_API_KEY  chave do Resend (obrigatória)
     CONTACT_EMAIL   quem recebe o aviso; aceita vários separados por vírgula (obrigatória)
     RESEND_FROM     remetente (opcional; padrão "Morada.ai <onboarding@resend.dev>",
                     que só entrega para o e-mail dono da conta do Resend) */

const esc = v => String(v == null ? "" : v)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
  .slice(0, 500);
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || ""));

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Método não permitido" }); }

  const { RESEND_API_KEY, CONTACT_EMAIL } = process.env;
  const FROM = process.env.RESEND_FROM || "Morada.ai <onboarding@resend.dev>";
  if (!RESEND_API_KEY) return res.status(500).json({ error: "RESEND_API_KEY não configurada" });
  if (!CONTACT_EMAIL) return res.status(500).json({ error: "CONTACT_EMAIL não configurado" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Corpo inválido" });

  // campo-isca: humano não vê, robô preenche → responde OK e não envia nada
  if (body.website) return res.status(200).json({ success: true });

  const { nome, email, empresa, cargo, telefone, tipoEmpresa, partnerName, tipo, ponto, utm = {}, pagina } = body;
  if (!nome || !isEmail(email) || !empresa || !telefone) return res.status(400).json({ error: "Campos obrigatórios ausentes" });

  const parceiro = partnerName || "Contato Geral";
  const subject = tipo === "parceiro"
    ? `Nova candidatura de parceria: ${String(empresa).slice(0, 80)}`
    : `Nova solicitação de parceiro: ${String(parceiro).slice(0, 80)}`;
  const linha = (rot, val) => `<li><strong>${rot}:</strong> ${esc(val) || "Não informado"}</li>`;
  const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .filter(k => utm && utm[k]).map(k => linha(k, utm[k])).join("");

  const html = `
    <h2>${tipo === "parceiro" ? "Nova candidatura de parceria" : "Nova solicitação de parceiro"}</h2>
    <p><strong>Parceiro:</strong> ${esc(parceiro)}</p>
    <hr />
    <h3>Dados do contato:</h3>
    <ul>
      ${linha("Nome", nome)}
      ${linha("Email", email)}
      ${linha("Empresa", empresa)}
      ${linha("Cargo", cargo)}
      ${linha("Telefone", "+55 " + telefone)}
      ${linha("Tipo de empresa", tipoEmpresa)}
    </ul>
    <h3>Origem:</h3>
    <ul>
      ${linha("Ponto de conversão", ponto)}
      ${utms || "<li>Sem UTM (acesso direto)</li>"}
      ${linha("Página", pagina)}
    </ul>
    <p style="color:#888;font-size:12px">Enviado pela LP Parceiros Oficiais. O mesmo lead também foi para o HubSpot (formulário "Landing Page Parceiros Oficiais - Contato").</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: CONTACT_EMAIL.split(",").map(s => s.trim()).filter(Boolean),
        reply_to: email,
        subject,
        html
      })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("[send-email] Resend recusou", r.status, JSON.stringify(data));
      return res.status(502).json({ error: data.message || "Erro ao enviar e-mail" });
    }
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error("[send-email] falha", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
