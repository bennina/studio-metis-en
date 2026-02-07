// lib/email/quoteEmail.ts
// Email template for quotes

import { getMailer } from "@/lib/mailer";
import type { BriefData } from "@/lib/brief/briefTypes";
import { formatPrice } from "@/lib/brief/pricingData";

interface QuoteEmailOptions {
  briefData: BriefData;
  quoteNumber: string;
  pdfHtml: string;
}

/**
 * Invia email di notifica per il nuovo preventivo
 */
export async function sendQuoteNotificationEmail(
  options: QuoteEmailOptions
): Promise<void> {
  const { briefData, quoteNumber } = options;
  const mailer = getMailer();

  const discount = briefData.discountPercent || 0;
  const discountedTotal = briefData.total * (1 - discount / 100);

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + briefData.validityDays);

  const emailHtml = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #A9445B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; width: 150px; color: #666; }
    .total-box { background: #A9445B; color: white; padding: 15px; text-align: center; font-size: 24px; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
    .cta { display: inline-block; background: #1CBBA4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Nuovo Preventivo Generato</h1>
    <p style="margin: 10px 0 0; opacity: 0.9;">${quoteNumber}</p>
  </div>

  <div class="content">
    <h2 style="color: #A9445B; margin-top: 0;">Dettagli Cliente</h2>

    ${briefData.clientInfo.companyName ? `<div class="info-row"><span class="info-label">Azienda:</span> ${briefData.clientInfo.companyName}</div>` : ""}
    ${briefData.clientInfo.projectName ? `<div class="info-row"><span class="info-label">Progetto:</span> ${briefData.clientInfo.projectName}</div>` : ""}
    ${briefData.clientInfo.contactName ? `<div class="info-row"><span class="info-label">Referente:</span> ${briefData.clientInfo.contactName}</div>` : ""}
    ${briefData.clientInfo.contactEmail ? `<div class="info-row"><span class="info-label">Email:</span> <a href="mailto:${briefData.clientInfo.contactEmail}">${briefData.clientInfo.contactEmail}</a></div>` : ""}
    ${briefData.clientInfo.contactPhone ? `<div class="info-row"><span class="info-label">Telefono:</span> <a href="tel:${briefData.clientInfo.contactPhone}">${briefData.clientInfo.contactPhone}</a></div>` : ""}

    <h2 style="color: #A9445B; margin-top: 20px;">Riepilogo Economico</h2>

    <div class="info-row"><span class="info-label">Subtotale:</span> ${formatPrice(briefData.total)}</div>
    ${discount > 0 ? `<div class="info-row"><span class="info-label">Sconto (${discount}%):</span> -${formatPrice(briefData.total * discount / 100)}</div>` : ""}
    ${briefData.recurring > 0 ? `<div class="info-row"><span class="info-label">Costi ricorrenti:</span> ${formatPrice(briefData.recurring)}/periodo</div>` : ""}

    <div class="info-row"><span class="info-label">Validità:</span> Fino al ${validUntil.toLocaleDateString("it-IT")}</div>

    ${briefData.internalNotes ? `
    <h2 style="color: #A9445B; margin-top: 20px;">Note Interne</h2>
    <p style="background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107;">${briefData.internalNotes}</p>
    ` : ""}
  </div>

  <div class="total-box">
    <strong>Totale: ${formatPrice(discountedTotal)}</strong>
  </div>

  <div class="footer">
    <p>Questo preventivo è stato generato automaticamente da Brief Builder.</p>
    <p>Metis Web Agency - info@metiswebagency.it</p>
  </div>
</body>
</html>`;

  // Invia a te stessa (notifica interna)
  await mailer.sendMail({
    from: process.env.SMTP_FROM || "noreply@metiswebagency.it",
    to: process.env.QUOTE_NOTIFICATION_EMAIL || "info@metiswebagency.it",
    subject: `📋 Nuovo Preventivo ${quoteNumber} - ${briefData.clientInfo.companyName || "Nuovo Cliente"}`,
    html: emailHtml,
  });
}

/**
 * Invia il preventivo al cliente
 */
export async function sendQuoteToClient(
  options: QuoteEmailOptions & { clientEmail: string }
): Promise<void> {
  const { briefData, quoteNumber, clientEmail, pdfHtml } = options;
  const mailer = getMailer();

  const emailHtml = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #A9445B 0%, #540c29 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 25px; border: 1px solid #ddd; }
    .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 0 0 8px 8px; }
    .cta { display: inline-block; background: #1CBBA4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://metiswebagency.it/images/logo-white.svg" alt="Metis Web Agency" style="height: 50px; margin-bottom: 15px;">
    <h1 style="margin: 0; font-size: 24px;">Il tuo preventivo è pronto</h1>
    <p style="margin: 10px 0 0; opacity: 0.9;">N° ${quoteNumber}</p>
  </div>

  <div class="content">
    <p>Gentile ${briefData.clientInfo.contactName || "Cliente"},</p>

    <p>grazie per averci contattato. In allegato trovi il preventivo personalizzato per il progetto <strong>${briefData.clientInfo.projectName || "richiesto"}</strong>.</p>

    <p>Il preventivo include tutti i dettagli dei servizi proposti, i costi e le tempistiche. Siamo a disposizione per qualsiasi chiarimento.</p>

    <p style="text-align: center;">
      <a href="mailto:info@metiswebagency.it?subject=Re: Preventivo ${quoteNumber}" class="cta">Rispondi al preventivo</a>
    </p>

    <p>Cordiali saluti,<br>
    <strong>Elisabetta Monaco</strong><br>
    Metis Web Agency</p>
  </div>

  <div class="footer">
    <p><strong>Metis Web Agency</strong></p>
    <p>Via Mongitore, 40 - 92013 Menfi (AG)</p>
    <p>Tel: +39 349 445 9317 | Email: info@metiswebagency.it</p>
    <p style="margin-top: 10px; font-size: 11px;">
      Il presente preventivo è valido per ${briefData.validityDays} giorni dalla data di emissione.
    </p>
  </div>
</body>
</html>`;

  await mailer.sendMail({
    from: process.env.SMTP_FROM || "noreply@metiswebagency.it",
    to: clientEmail,
    cc: process.env.QUOTE_NOTIFICATION_EMAIL || "info@metiswebagency.it",
    subject: `Preventivo ${quoteNumber} - Metis Web Agency`,
    html: emailHtml,
    attachments: [
      {
        filename: `preventivo-${quoteNumber}.html`,
        content: pdfHtml,
        contentType: "text/html",
      },
    ],
  });
}
