import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { getMailer } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseUrlFromRequest(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function asBool(val: FormDataEntryValue | null) {
  if (val == null) return false;
  const s = String(val).trim().toLowerCase();
  return s === "on" || s === "true" || s === "1" || s === "yes";
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const redirectParam = url.searchParams.get("redirect");

  const base = baseUrlFromRequest(req);
  const referer = req.headers.get("referer");

  const redirectBackWith = (params: Record<string, string>) => {
    const back = referer ? new URL(referer) : new URL("/contatti", base);
    for (const [k, v] of Object.entries(params)) back.searchParams.set(k, v);
    return NextResponse.redirect(back, 303);
  };

  const formData = await req.formData();

  /**
   * ✅ IMPORTANTISSIMO:
   * Nel tuo form hai un campo "website" reale (sito web del cliente).
   * Quindi NON possiamo usarlo come honeypot, altrimenti chi lo compila viene scartato.
   * Usiamo un campo hidden dedicato, es: "_hp" (da aggiungere lato form).
   */
  const honeypot = String(formData.get("_hp") ?? "").trim();
  if (honeypot) {
    // bot compilano campi nascosti: fingi successo
    const fallback = new URL("/contatti?success=1", base);
    return NextResponse.redirect(fallback, 303);
  }

  // Campi base (i tuoi JSON usano: name, email, phone, company, website, message, privacy, newsletter)
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const privacy = asBool(formData.get("privacy"));
  const newsletter = asBool(formData.get("newsletter"));

  if (!name) return redirectBackWith({ error: "name_required" });
  if (!isValidEmail(email)) return redirectBackWith({ error: "email_invalid" });
  if (!privacy) return redirectBackWith({ error: "privacy_required" });
  if (!message) return redirectBackWith({ error: "message_required" });

  /**
   * 1) Salvataggio DB (opzionale)
   * Se NON hai ancora una tabella definita, disattiva con CONTACT_DB_ENABLED=0
   *
   * Consiglio tabella:
   * contacts(id, created_at, name, email, phone, company, website, message, privacy, newsletter, source_url)
   */
  const dbEnabled = (process.env.CONTACT_DB_ENABLED ?? "0") === "1";
  if (dbEnabled) {
    try {
      const pool = getDbPool();
      await pool.execute(
        `
        INSERT INTO \`contacts\`
          (\`created_at\`, \`name\`, \`email\`, \`phone\`, \`company\`, \`website\`, \`message\`, \`privacy\`, \`newsletter\`, \`source_url\`)
        VALUES
          (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          name,
          email,
          phone || null,
          company || null,
          website || null,
          message,
          privacy ? 1 : 0,
          newsletter ? 1 : 0,
          referer || null,
        ]
      );
    } catch (e) {
      // non blocchiamo l’invio mail se il DB fallisce
      console.error("[contact] DB insert failed:", e);
    }
  }

  /**
   * 2) Invio email a Metis web agency
   */
  try {
    const transporter = getMailer();

    // ✅ DATI Metis web agency
    const to = process.env.CONTACT_TO ?? "info@metiswebagency.it";
    // Meglio usare SMTP_USER come FROM reale, ma fallback coerente col dominio
    const from =
      process.env.CONTACT_FROM ??
      process.env.SMTP_USER ??
      "noreply@metiswebagency.it";

    const lines: string[] = [];
    lines.push("Nuova richiesta dal sito • Metis web agency");
    lines.push("----------------------------------------");
    lines.push(`Nome: ${name}`);
    lines.push(`Email: ${email}`);
    if (phone) lines.push(`Telefono: ${phone}`);
    if (company) lines.push(`Azienda: ${company}`);
    if (website) lines.push(`Sito: ${website}`);
    lines.push("");
    lines.push("Messaggio:");
    lines.push(message);
    lines.push("----------------------------------------");
    lines.push(`Privacy: ${privacy ? "1" : "0"}`);
    lines.push(`Newsletter: ${newsletter ? "1" : "0"}`);
    if (referer) lines.push(`Pagina origine: ${referer}`);

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `Richiesta dal sito Metis web agency — ${name}`,
      text: lines.join("\n"),
    });
  } catch (e) {
    console.error("[contact] SMTP send failed:", e);
    return redirectBackWith({ error: "mail_send_failed" });
  }

  /**
   * 3) Redirect (HTML form friendly)
   */
  if (redirectParam) {
    return NextResponse.redirect(new URL(redirectParam, base), 303);
  }

  // cambia pure la pagina di grazie se vuoi (es. /grazie)
  return NextResponse.redirect(new URL("/email-sent", base), 303);
}
