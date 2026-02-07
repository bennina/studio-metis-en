import { escapeHtml, formatDateTime, formatEuro } from "../utils";

type LeadPayload = {
  quizId?: string;
  sessionId?: string;
  answers?: Record<string, any>;
  contact?: Record<string, any>;
  range?: { min?: number; max?: number; score?: number };
  meta?: {
    page?: string;
    referrer?: string;
    utm?: Record<string, string | undefined>;
    userAgent?: string;
  };
  ts?: number;
};

function toTextLines(payload: LeadPayload) {
  const c = payload.contact ?? {};
  const r = payload.range ?? {};
  const lines: string[] = [];
  lines.push("Nuova richiesta preventivo • Metis Web Agency");
  lines.push("----------------------------------------");
  lines.push(`Data: ${formatDateTime(payload.ts ? new Date(payload.ts) : new Date())}`);
  if (payload.quizId) lines.push(`Quiz: ${payload.quizId}`);
  if (payload.sessionId) lines.push(`Session: ${payload.sessionId}`);
  lines.push("");
  lines.push("Contatto:");
  if (c.name) lines.push(`- Nome: ${c.name}`);
  if (c.email) lines.push(`- Email: ${c.email}`);
  if (c.phone) lines.push(`- Telefono: ${c.phone}`);
  if (c.company) lines.push(`- Azienda: ${c.company}`);
  lines.push("");
  if (r.min || r.max) {
    lines.push(`Stima: ${formatEuro(r.min)} – ${formatEuro(r.max)} (score: ${r.score ?? "-"})`);
    lines.push("");
  }

  if (payload.answers && Object.keys(payload.answers).length) {
    lines.push("Risposte:");
    for (const [k, v] of Object.entries(payload.answers)) {
      lines.push(`- ${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`);
    }
  }

  if (payload.meta) {
    lines.push("");
    lines.push("Meta:");
    if (payload.meta.page) lines.push(`- Pagina: ${payload.meta.page}`);
    if (payload.meta.referrer) lines.push(`- Referrer: ${payload.meta.referrer}`);
    if (payload.meta.utm) {
      const u = payload.meta.utm;
      const utmStr = Object.entries(u)
        .filter(([, val]) => !!val)
        .map(([key, val]) => `${key}=${val}`)
        .join(" ");
      if (utmStr) lines.push(`- UTM: ${utmStr}`);
    }
  }

  return lines.join("\n");
}

export function buildLeadInternalEmail(payload: LeadPayload) {
  const c = payload.contact ?? {};
  const r = payload.range ?? {};

  const subjectName = c.name ? String(c.name).trim() : "Nuovo contatto";
  const subject = `Preventivo richiesto — ${subjectName}`;

  const answersRows = Object.entries(payload.answers ?? {}).map(([k, v]) => {
    const value = typeof v === "string" ? v : JSON.stringify(v);
    return `
      <tr>
        <td style="padding:10px 12px;border-top:1px solid #E6E4E1;color:#32312c;font-size:14px;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="padding:10px 12px;border-top:1px solid #E6E4E1;color:#32312c;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`;
  });

  const html = `
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f6f5f3;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="width:640px;max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.06);">
          <tr>
            <td style="padding:20px 24px;background:linear-gradient(135deg,#4c0222,#202043);color:#fff;">
              <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.9;">Metis Web Agency</div>
              <div style="font-size:22px;font-weight:700;line-height:1.2;margin-top:6px;">Nuova richiesta di preventivo</div>
              <div style="font-size:14px;opacity:.9;margin-top:8px;">${escapeHtml(formatDateTime(payload.ts ? new Date(payload.ts) : new Date()))}</div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 24px;">
              <div style="font-size:16px;font-weight:700;color:#20201d;margin-bottom:10px;">Contatto</div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E6E4E1;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;width:160px;">Nome</td>
                  <td style="padding:10px 12px;color:#20201d;font-size:14px;">${escapeHtml(c.name ?? "-")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;width:160px;">Email</td>
                  <td style="padding:10px 12px;color:#20201d;font-size:14px;">${escapeHtml(c.email ?? "-")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;width:160px;">Telefono</td>
                  <td style="padding:10px 12px;color:#20201d;font-size:14px;">${escapeHtml(c.phone ?? "-")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;width:160px;">Azienda</td>
                  <td style="padding:10px 12px;color:#20201d;font-size:14px;">${escapeHtml(c.company ?? "-")}</td>
                </tr>
              </table>

              <div style="height:16px;"></div>

              <div style="font-size:16px;font-weight:700;color:#20201d;margin-bottom:10px;">Stima</div>
              <div style="border:1px solid #E6E4E1;border-radius:12px;padding:14px 16px;background:#ffffff;">
                <div style="font-size:28px;font-weight:800;color:#4c0222;line-height:1.1;">${escapeHtml(formatEuro(r.min))} – ${escapeHtml(formatEuro(r.max))}</div>
                <div style="font-size:13px;color:#595750;margin-top:6px;">Score: ${escapeHtml(r.score ?? "-")}</div>
              </div>

              <div style="height:18px;"></div>

              <div style="font-size:16px;font-weight:700;color:#20201d;margin-bottom:10px;">Riepilogo risposte</div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #E6E4E1;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;font-weight:700;">Domanda</td>
                  <td style="padding:10px 12px;background:#f6f5f3;color:#595750;font-size:12px;font-weight:700;">Risposta</td>
                </tr>
                ${answersRows.join("\n") || `
                  <tr>
                    <td colspan="2" style="padding:12px;color:#595750;font-size:14px;border-top:1px solid #E6E4E1;">Nessuna risposta trovata.</td>
                  </tr>`}
              </table>

              <div style="height:18px;"></div>

              <div style="font-size:12px;color:#918d84;line-height:1.5;">
                <div><b>Quiz:</b> ${escapeHtml(payload.quizId ?? "-")}</div>
                <div><b>Session:</b> ${escapeHtml(payload.sessionId ?? "-")}</div>
                ${payload.meta?.page ? `<div><b>Pagina:</b> ${escapeHtml(payload.meta.page)}</div>` : ""}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;background:#f6f5f3;color:#595750;font-size:12px;line-height:1.6;">
              Metis Web Agency di Elisabetta Monaco • Via Mongitore, 40 - Menfi (AG) • P.IVA 02876000841<br />
              Tel. 3494459317 • info@metiswebagency.it
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = toTextLines(payload);

  return { subject, html, text };
}
