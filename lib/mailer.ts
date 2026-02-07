// lib/mailer.ts
import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

export function getMailer() {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = String(process.env.SMTP_SECURE ?? "true") === "true";

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP env vars. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT/SMTP_SECURE)."
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return _transporter;
}
