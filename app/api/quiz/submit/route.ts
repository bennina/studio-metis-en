import { NextResponse } from "next/server";
import { getMailer } from "@/lib/mailer";
import { getDbPool } from "@/lib/db";
import { buildLeadInternalEmail } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  quizId?: string;
  sessionId?: string;
  answers?: Record<string, any>;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    privacy?: boolean;
    newsletter?: boolean;
  };
  range?: { min?: number; max?: number; score?: number };
  meta?: {
    page?: string;
    referrer?: string;
    utm?: Record<string, string | undefined>;
    userAgent?: string;
  };
  _hp?: string; // honeypot
  ts?: number;
};

function isEmailLike(email: string) {
  // Minimal validation: enough to block obvious junk without rejecting real addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as SubmitBody | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  // Honeypot: if filled -> pretend OK (anti-bot) but do nothing.
  if (body._hp) return NextResponse.json({ ok: true });

  const contact = body.contact ?? {};
  if (!contact.name || !contact.email || !contact.phone) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 400 });
  }
  if (!isEmailLike(contact.email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!contact.privacy) {
    return NextResponse.json({ ok: false, error: "privacy_required" }, { status: 400 });
  }

  const now = Date.now();
  const payload: SubmitBody = {
    ...body,
    ts: body.ts ?? now,
    meta: {
      ...(body.meta ?? {}),
      userAgent: body.meta?.userAgent ?? req.headers.get("user-agent") ?? undefined,
      referrer: body.meta?.referrer ?? req.headers.get("referer") ?? undefined,
    },
  };

  // 1) Save on DB (primary source of truth)
  let leadId: number | null = null;
  try {
    const pool = getDbPool();

    // Create table (idempotent) — safe for first deploy.
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS quiz_leads (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        quiz_id VARCHAR(120) NULL,
        session_id VARCHAR(120) NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(80) NOT NULL,
        company VARCHAR(255) NULL,
        range_min INT NULL,
        range_max INT NULL,
        score INT NULL,
        answers_json JSON NULL,
        meta_json JSON NULL,
        PRIMARY KEY (id),
        KEY idx_created_at (created_at),
        KEY idx_email (email(64)),
        KEY idx_session (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [result] = await pool.execute<
      any
    >(
      `INSERT INTO quiz_leads
        (quiz_id, session_id, name, email, phone, company, range_min, range_max, score, answers_json, meta_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ,
      [
        payload.quizId ?? null,
        payload.sessionId ?? null,
        String(contact.name),
        String(contact.email),
        String(contact.phone),
        contact.company ? String(contact.company) : null,
        payload.range?.min ?? null,
        payload.range?.max ?? null,
        payload.range?.score ?? null,
        payload.answers ? JSON.stringify(payload.answers) : null,
        payload.meta ? JSON.stringify(payload.meta) : null,
      ]
    );

    leadId = Number(result.insertId ?? null) || null;
  } catch (e) {
    console.error("[quiz/submit] DB insert failed:", e);
    // don't block the lead if DB fails: try email anyway
  }

  // 2) Send internal email
  try {
    const transporter = getMailer();
    const to = process.env.CONTACT_TO ?? "info@metiswebagency.it";
    const fromEmail = process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? "noreply@metiswebagency.it";
    const fromName = process.env.CONTACT_FROM_NAME ?? "Metis web agency di Elisabetta Monaco";

    const { subject, html, text } = buildLeadInternalEmail(payload as any);

    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to,
      replyTo: contact.email,
      subject: leadId ? `${subject} (#${leadId})` : subject,
      html,
      text,
    });
  } catch (e) {
    console.error("[quiz/submit] SMTP send failed:", e);
    return NextResponse.json({ ok: false, error: "mail_send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: leadId });
}
