// app/api/brief/generate/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { BriefData } from "@/lib/brief/briefTypes";
import {
  SERVICES,
  formatPrice,
  formatPriceUnit,
} from "@/lib/brief/pricingData";
import { generateQuoteNumber, saveQuote } from "@/lib/db/quotes";
import { sendQuoteNotificationEmail } from "@/lib/email/quoteEmail";

export const runtime = "nodejs";

/**
 * POST /api/brief/generate
 *
 * Genera un HTML del preventivo formattato per la stampa PDF.
 * Salva il preventivo nel database e invia notifica email.
 */
export async function POST(request: NextRequest) {
  try {
    const briefData: BriefData = await request.json();

    // Genera numero preventivo univoco
    let quoteNumber: string;
    try {
      quoteNumber = await generateQuoteNumber();
    } catch {
      // Fallback se DB non disponibile
      quoteNumber = `PREV-${Date.now()}`;
    }

    // Genera HTML per il preventivo
    const html = generateBriefHTML(briefData, quoteNumber);

    // Salva nel database (in background, non bloccare la risposta)
    saveQuoteAsync(briefData, quoteNumber, html);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Quote-Number": quoteNumber,
      },
    });
  } catch (error) {
    console.error("Error generating brief:", error);
    return NextResponse.json(
      { error: "Errore nella generazione del preventivo" },
      { status: 500 }
    );
  }
}

/**
 * Salva preventivo e invia email in background
 */
async function saveQuoteAsync(
  briefData: BriefData,
  quoteNumber: string,
  pdfHtml: string
) {
  try {
    // Salva nel database
    await saveQuote(briefData, quoteNumber);
    console.log(`Quote ${quoteNumber} saved to database`);

    // Invia email di notifica
    await sendQuoteNotificationEmail({
      briefData,
      quoteNumber,
      pdfHtml,
    });
    console.log(`Quote notification email sent for ${quoteNumber}`);
  } catch (error) {
    console.error("Error in background save/email:", error);
  }
}

function generateBriefHTML(data: BriefData, quoteNumber: string): string {
  const selectedSiteService = data.selectedSiteType
    ? SERVICES.find((s) => s.id === data.selectedSiteType)
    : null;

  // Group services by category
  const servicesByCategory = data.selectedServices.reduce(
    (acc, selected) => {
      const service = SERVICES.find((s) => s.id === selected.serviceId);
      if (service) {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push({ service, selected });
      }
      return acc;
    },
    {} as Record<
      string,
      Array<{
        service: (typeof SERVICES)[0];
        selected: (typeof data.selectedServices)[0];
      }>
    >
  );

  const categoryLabels: Record<string, string> = {
    tipologia_sito: "Tipologia Sito",
    infrastruttura: "Infrastruttura",
    contenuti: "Contenuti",
    brand: "Brand & Identity",
    funzionalita: "Funzionalità",
    tracking: "Tracking & Analytics",
    post_lancio: "Post-Lancio",
  };

  const discount = data.discountPercent || 0;
  const discountedTotal = data.total * (1 - discount / 100);

  const today = new Date();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + data.validityDays);

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preventivo ${quoteNumber} - ${data.clientInfo.companyName || "Draft"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: #A9445B;
      --color-primary-dark: #540c29;
      --color-secondary: #436BA8;
      --color-accent: #1CBBA4;
      --color-neutral-100: #f6f5f3;
      --color-neutral-200: #e6e4e1;
      --color-neutral-700: #32312c;
      --color-neutral-800: #20201d;
      --color-neutral-900: #151512;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Barlow', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: var(--color-neutral-900);
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      .signature-section { page-break-inside: avoid; }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--color-primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-left { flex: 1; }

    .header-right {
      text-align: right;
      min-width: 200px;
    }

    .logo { width: 180px; height: auto; }
    .logo svg { width: 100%; height: auto; }

    .document-title {
      font-size: 32px;
      font-weight: 700;
      margin: 20px 0 10px;
      color: var(--color-primary-dark);
    }

    .document-meta {
      color: var(--color-neutral-700);
      font-size: 14px;
    }

    .quote-number {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-neutral-100);
      padding: 10px 15px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 10px;
    }

    .quote-date {
      font-size: 14px;
      color: var(--color-neutral-700);
    }

    .section { margin-bottom: 30px; }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-neutral-200);
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 8px 20px;
    }

    .info-label {
      color: var(--color-neutral-700);
      font-size: 14px;
      font-weight: 500;
    }

    .info-value { font-size: 14px; }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .company-info {
      background: var(--color-neutral-100);
      padding: 15px;
      border-radius: 6px;
      font-size: 13px;
    }

    .company-info h4 {
      color: var(--color-primary);
      margin-bottom: 10px;
      font-size: 14px;
    }

    .services-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .services-table th {
      text-align: left;
      padding: 12px;
      background: var(--color-neutral-100);
      border-bottom: 2px solid var(--color-primary);
      font-weight: 600;
      font-size: 14px;
      color: var(--color-neutral-900);
    }

    .services-table td {
      padding: 12px;
      border-bottom: 1px solid var(--color-neutral-200);
      font-size: 14px;
      vertical-align: top;
    }

    .services-table .service-name {
      font-weight: 600;
      color: var(--color-neutral-900);
    }

    .services-table .service-desc {
      color: var(--color-neutral-700);
      font-size: 13px;
      margin-top: 4px;
    }

    .services-table .service-why {
      color: var(--color-secondary);
      font-size: 12px;
      margin-top: 6px;
      font-style: italic;
    }

    .services-table .price {
      text-align: right;
      white-space: nowrap;
      font-weight: 500;
    }

    .category-header td {
      background: var(--color-secondary);
      color: white;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 12px;
    }

    .totals {
      margin-top: 20px;
      border-top: 3px solid var(--color-primary);
      padding-top: 15px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .total-row.grand-total {
      font-size: 22px;
      font-weight: 700;
      color: var(--color-primary);
      border-top: 1px solid var(--color-neutral-200);
      padding-top: 15px;
      margin-top: 10px;
    }

    .total-row.discount {
      color: var(--color-accent);
      font-weight: 500;
    }

    .recurring-note {
      font-size: 12px;
      color: var(--color-neutral-700);
      margin-top: 15px;
      padding: 12px;
      background: var(--color-neutral-100);
      border-radius: 6px;
      border-left: 4px solid var(--color-accent);
    }

    .notes-section {
      background: var(--color-neutral-100);
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
    }

    .terms-section {
      font-size: 12px;
      color: var(--color-neutral-700);
      margin-top: 30px;
      padding: 20px;
      background: var(--color-neutral-100);
      border-radius: 6px;
    }

    .terms-section h3 {
      font-size: 14px;
      color: var(--color-primary);
      margin-bottom: 10px;
    }

    .terms-section ul {
      padding-left: 20px;
      margin: 0;
    }

    .terms-section li {
      margin-bottom: 5px;
    }

    .signature-section {
      margin-top: 50px;
      padding: 30px;
      border: 2px solid var(--color-neutral-200);
      border-radius: 8px;
      background: #fafafa;
    }

    .signature-section h3 {
      font-size: 16px;
      color: var(--color-primary);
      margin-bottom: 20px;
      text-align: center;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .signature-box {
      text-align: center;
    }

    .signature-box h4 {
      font-size: 13px;
      color: var(--color-neutral-700);
      margin-bottom: 60px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .signature-line {
      border-top: 1px solid var(--color-neutral-700);
      padding-top: 10px;
      font-size: 12px;
      color: var(--color-neutral-700);
    }

    .signature-date {
      margin-top: 15px;
      font-size: 12px;
      color: var(--color-neutral-700);
    }

    .signature-date input {
      border: none;
      border-bottom: 1px solid var(--color-neutral-700);
      background: transparent;
      width: 150px;
      text-align: center;
      font-family: inherit;
    }

    .acceptance-text {
      text-align: center;
      font-size: 13px;
      color: var(--color-neutral-700);
      margin-top: 20px;
      font-style: italic;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--color-neutral-200);
      font-size: 12px;
      color: var(--color-neutral-700);
    }

    .footer strong { color: var(--color-primary-dark); }

    .validity {
      background: var(--color-primary);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 25px;
    }

    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 8px 0;
    }

    .benefits-list li {
      padding: 3px 0 3px 20px;
      position: relative;
      font-size: 12px;
      color: var(--color-neutral-700);
    }

    .benefits-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-weight: bold;
    }

    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 15px 30px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(169, 68, 91, 0.3);
      font-family: 'Barlow', sans-serif;
    }

    .print-button:hover { background: var(--color-primary-dark); }

    .legal-info {
      font-size: 11px;
      color: var(--color-neutral-700);
      margin-top: 30px;
      padding: 15px;
      border: 1px solid var(--color-neutral-200);
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="logo">
        <img src="/images/logo.svg" alt="Metis Web Agency" width="70" height="100" loading="eager">
      </div>
      <p style="font-size: 14px; margin-top: 10px;"><strong>Metis Web Agency</strong> di <strong>Elisabetta Monaco</strong></p>
      <p style="font-size: 12px; color: var(--color-neutral-700);">
        Sede operativa: Via Mongitore, 40 - 92013 Menfi (AG)<br>
        Sede legale: Via Garibaldi, 56 - 92013 Menfi (AG)<br>
        Sicilia – Italia
      </p>
      <p style="font-size: 12px; margin-top: 8px;">
        <strong>Email:</strong> <a href="mailto:info@metiswebagency.it" style="color: var(--color-primary);">info@metiswebagency.it</a><br>
        <strong>Tel:</strong> <a href="tel:+393494459317" style="color: var(--color-primary);">+39 349 445 9317</a><br>
        <strong>Ufficio:</strong> <a href="tel:+390925969901" style="color: var(--color-primary);">0925 969901</a>
      </p>
    </div>
    <div class="header-right">
      <div class="quote-number">${quoteNumber}</div>
      <p class="quote-date">
        <strong>Data:</strong> ${today.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
      </p>
      <p class="quote-date">
        <strong>Valido fino al:</strong> ${validUntil.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
      </p>
    </div>
  </div>

  <h1 class="document-title">Preventivo</h1>
  <p class="document-meta">
    ${data.clientInfo.projectName ? `Progetto: <strong>${data.clientInfo.projectName}</strong>` : ""}
  </p>

  <div class="validity">
    ⏰ Preventivo valido fino al ${validUntil.toLocaleDateString("it-IT")}
  </div>

  <div class="section">
    <div class="two-column">
      <div class="company-info">
        <h4>📋 Fornitore</h4>
        <p><strong>Metis Web Agency</strong><br>
        di Elisabetta Monaco<br>
        P.IVA: [DA INSERIRE]<br>
        Via Mongitore, 40<br>
        92013 Menfi (AG) - Italia</p>
      </div>
      <div class="company-info">
        <h4>👤 Cliente</h4>
        <p>
          ${data.clientInfo.companyName ? `<strong>${data.clientInfo.companyName}</strong><br>` : ""}
          ${data.clientInfo.contactName ? `Att.ne: ${data.clientInfo.contactName}<br>` : ""}
          ${data.clientInfo.contactEmail ? `Email: ${data.clientInfo.contactEmail}<br>` : ""}
          ${data.clientInfo.contactPhone ? `Tel: ${data.clientInfo.contactPhone}<br>` : ""}
          ${data.clientInfo.sector ? `Settore: ${data.clientInfo.sector}` : ""}
        </p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📦 Dettaglio Servizi</h2>
    <table class="services-table">
      <thead>
        <tr>
          <th style="width: 60%">Servizio</th>
          <th style="width: 20%">Tipo</th>
          <th style="width: 20%" class="price">Importo</th>
        </tr>
      </thead>
      <tbody>
        ${
          selectedSiteService
            ? `
          <tr class="category-header">
            <td colspan="3">Tipologia Sito</td>
          </tr>
          <tr>
            <td>
              <div class="service-name">${selectedSiteService.name}</div>
              <div class="service-desc">${selectedSiteService.description}</div>
              <div class="service-why">${selectedSiteService.whyNeeded}</div>
              <ul class="benefits-list">
                ${selectedSiteService.benefits.map((b) => `<li>${b}</li>`).join("")}
              </ul>
            </td>
            <td>${formatPriceUnit(selectedSiteService.priceUnit)}</td>
            <td class="price">${formatPrice(selectedSiteService.price)}</td>
          </tr>
        `
            : ""
        }

        ${Object.entries(servicesByCategory)
          .map(
            ([category, items]) => `
          <tr class="category-header">
            <td colspan="3">${categoryLabels[category] || category}</td>
          </tr>
          ${items
            .map(({ service, selected }) => {
              const qty = selected.quantity || 1;
              const price = service.price * qty;
              return `
            <tr>
              <td>
                <div class="service-name">${service.name}${qty > 1 ? ` (x${qty})` : ""}</div>
                <div class="service-desc">${service.description}</div>
                <div class="service-why">${service.whyNeeded}</div>
                <ul class="benefits-list">
                  ${service.benefits.map((b) => `<li>${b}</li>`).join("")}
                </ul>
              </td>
              <td>${formatPriceUnit(service.priceUnit)}</td>
              <td class="price">${formatPrice(price)}</td>
            </tr>
          `;
            })
            .join("")}
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotale servizi</span>
        <span>${formatPrice(data.total)}</span>
      </div>
      ${
        discount > 0
          ? `
        <div class="total-row discount">
          <span>Sconto ${discount}%${data.discountReason ? ` (${data.discountReason})` : ""}</span>
          <span>-${formatPrice((data.total * discount) / 100)}</span>
        </div>
      `
          : ""
      }
      <div class="total-row grand-total">
        <span>TOTALE (IVA esclusa)</span>
        <span>${formatPrice(discountedTotal)}</span>
      </div>
      ${
        data.recurring > 0
          ? `
        <div class="recurring-note">
          <strong>💳 Costi ricorrenti:</strong> ${formatPrice(data.recurring)} /periodo
          <br><small>I costi ricorrenti includono servizi con fatturazione mensile, trimestrale o annuale. Tali costi si aggiungono al totale una tantum sopra indicato.</small>
        </div>
      `
          : ""
      }
    </div>
  </div>

  ${
    data.paymentTerms
      ? `
    <div class="section">
      <h2 class="section-title">💰 Condizioni di Pagamento</h2>
      <p>${data.paymentTerms}</p>
    </div>
  `
      : `
    <div class="section">
      <h2 class="section-title">💰 Condizioni di Pagamento</h2>
      <p>50% all'accettazione del preventivo, 50% alla consegna del progetto.<br>
      Pagamento tramite bonifico bancario entro 7 giorni dalla fattura.</p>
    </div>
  `
  }

  ${
    data.clientNotes
      ? `
    <div class="section">
      <h2 class="section-title">📝 Note</h2>
      <div class="notes-section">
        ${data.clientNotes.replace(/\n/g, "<br>")}
      </div>
    </div>
  `
      : ""
  }

  <div class="terms-section">
    <h3>📜 Termini e Condizioni</h3>
    <ul>
      <li>Il presente preventivo ha validità di <strong>${data.validityDays} giorni</strong> dalla data di emissione.</li>
      <li>I prezzi indicati sono al netto di IVA (22%).</li>
      <li>Le tempistiche di realizzazione saranno concordate dopo l'accettazione del preventivo.</li>
      <li>Eventuali modifiche sostanziali al progetto potrebbero comportare variazioni di prezzo.</li>
      <li>Il cliente si impegna a fornire tutti i materiali necessari (testi, immagini, loghi) nei tempi concordati.</li>
      <li>I diritti di proprietà intellettuale del lavoro saranno trasferiti al cliente dopo il saldo completo.</li>
      <li>Per controversie sarà competente il Foro di Sciacca (AG).</li>
    </ul>
  </div>

  <div class="signature-section">
    <h3>✍️ Per Accettazione</h3>
    <p class="acceptance-text">
      Il sottoscritto dichiara di aver preso visione e di accettare integralmente il presente preventivo e le relative condizioni.
    </p>
    <div class="signature-grid">
      <div class="signature-box">
        <h4>Il Fornitore</h4>
        <div class="signature-line">Metis Web Agency</div>
        <p class="signature-date">Data: ${today.toLocaleDateString("it-IT")}</p>
      </div>
      <div class="signature-box">
        <h4>Il Cliente</h4>
        <div class="signature-line">Firma e Timbro</div>
        <p class="signature-date">Data: ____________________</p>
      </div>
    </div>
  </div>

  <div class="legal-info">
    <p><strong>Metis Web Agency</strong> di Elisabetta Monaco | P.IVA: [DA INSERIRE] | REA: [DA INSERIRE]</p>
    <p>Sede: Via Mongitore, 40 - 92013 Menfi (AG) | Email: info@metiswebagency.it | Tel: +39 349 445 9317</p>
    <p style="margin-top: 8px; font-size: 10px;">
      Documento generato automaticamente il ${today.toLocaleDateString("it-IT")} alle ${today.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}.
      Riferimento: ${quoteNumber}
    </p>
  </div>

  <button class="print-button no-print" onclick="window.print()">
    🖨️ Salva come PDF
  </button>
</body>
</html>`;
}
