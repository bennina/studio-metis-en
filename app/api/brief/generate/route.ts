// app/api/brief/generate/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { BriefData } from '@/lib/brief/briefTypes';
import { SERVICES, formatPrice, formatPriceUnit } from '@/lib/brief/pricingData';

/**
 * POST /api/brief/generate
 *
 * Genera un HTML del preventivo formattato per la stampa PDF.
 * Il client può usare window.print() per salvare come PDF.
 */
export async function POST(request: NextRequest) {
  try {
    const briefData: BriefData = await request.json();

    // Genera HTML per il preventivo
    const html = generateBriefHTML(briefData);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating brief:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione del preventivo' },
      { status: 500 }
    );
  }
}

function generateBriefHTML(data: BriefData): string {
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
    {} as Record<string, Array<{ service: (typeof SERVICES)[0]; selected: (typeof data.selectedServices)[0] }>>
  );

  const categoryLabels: Record<string, string> = {
    tipologia_sito: 'Tipologia Sito',
    infrastruttura: 'Infrastruttura',
    contenuti: 'Contenuti',
    brand: 'Brand & Identity',
    funzionalita: 'Funzionalità',
    tracking: 'Tracking & Analytics',
    post_lancio: 'Post-Lancio',
  };

  const discount = data.discountPercent || 0;
  const discountedTotal = data.total * (1 - discount / 100);

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + data.validityDays);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preventivo - ${data.clientInfo.companyName || 'Draft'}</title>
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
      body {
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--color-primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-left {
      flex: 1;
    }

    .logo {
      width: 180px;
      height: auto;
    }

    .logo svg {
      width: 100%;
      height: auto;
    }

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

    .section {
      margin-bottom: 30px;
    }

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

    .info-value {
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

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--color-neutral-200);
      font-size: 12px;
      color: var(--color-neutral-700);
    }

    .footer strong {
      color: var(--color-primary-dark);
    }

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

    .print-button:hover {
      background: var(--color-primary-dark);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="logo">
       <img src="/images/logo.svg" alt="Metis web agency | Consulenza Digitale e Sviluppo Web" width="70" height="100" loading="eager" data-cmp-info="10">
       </div>
       <p class="font-sans text-lg font-medium [&amp;_b]:font-[600] text-primary-dark">di <b>Elisabetta Monaco</b></p>
       <p class="font-sans text-lg font-medium [&amp;_b]:font-[600] text-primary-dark"><b>Sede operativa: </b>Via Mongitore, 40 - Menfi (AG) <br><b>Sede legale: </b>Via garibaldi, 56 - Menfi (AG) <br> 92013 Sicilia – Italia</p>
       <div class="grid gap-2 mt-2">
       <p><b class="tracking-[1px]">Email:</b> <a class="text-primary-600" href="mailto:info@metiswebagency.it">info@metiswebagency.it</a></p>
       <p><b class="tracking-[1px]">Tel:</b> <a class="text-primary-600" href="tel:+393494459317">+39 3494459317</a></p>
       <p><b class="tracking-[1px]">Ufficio:</b> <a class="text-primary-600" href="tel:+390925969901">0925 969901</a></p>
       
      </div>
      <h1 class="document-title">Preventivo</h1>
      <p class="document-meta">
        ${data.clientInfo.projectName ? `Progetto: ${data.clientInfo.projectName} | ` : ''}
        Data: ${new Date().toLocaleDateString('it-IT')}
      </p>
    </div>
  </div>

  <div class="validity">
    Preventivo valido fino al ${validUntil.toLocaleDateString('it-IT')}
  </div>

  <div class="section">
    <h2 class="section-title">Informazioni Cliente</h2>
    <div class="info-grid">
      ${data.clientInfo.companyName ? `<div class="info-label">Azienda</div><div class="info-value">${data.clientInfo.companyName}</div>` : ''}
      ${data.clientInfo.contactName ? `<div class="info-label">Referente</div><div class="info-value">${data.clientInfo.contactName}</div>` : ''}
      ${data.clientInfo.contactEmail ? `<div class="info-label">Email</div><div class="info-value">${data.clientInfo.contactEmail}</div>` : ''}
      ${data.clientInfo.contactPhone ? `<div class="info-label">Telefono</div><div class="info-value">${data.clientInfo.contactPhone}</div>` : ''}
      ${data.clientInfo.sector ? `<div class="info-label">Settore</div><div class="info-value">${data.clientInfo.sector}</div>` : ''}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Dettaglio Servizi</h2>
    <table class="services-table">
      <thead>
        <tr>
          <th style="width: 60%">Servizio</th>
          <th style="width: 20%">Tipo</th>
          <th style="width: 20%" class="price">Importo</th>
        </tr>
      </thead>
      <tbody>
        ${selectedSiteService ? `
          <tr class="category-header">
            <td colspan="3">Tipologia Sito</td>
          </tr>
          <tr>
            <td>
              <div class="service-name">${selectedSiteService.name}</div>
              <div class="service-desc">${selectedSiteService.description}</div>
              <div class="service-why">${selectedSiteService.whyNeeded}</div>
              <ul class="benefits-list">
                ${selectedSiteService.benefits.map((b) => `<li>${b}</li>`).join('')}
              </ul>
            </td>
            <td>${formatPriceUnit(selectedSiteService.priceUnit)}</td>
            <td class="price">
              ${formatPrice(selectedSiteService.price)}
            </td>
          </tr>
        ` : ''}

        ${Object.entries(servicesByCategory)
          .map(
            ([category, items]) => `
          <tr class="category-header">
            <td colspan="3">${categoryLabels[category] || category}</td>
          </tr>
          ${items
            .map(
              ({ service, selected }) => {
                const qty = selected.quantity || 1;
                const price = service.price * qty;
                return `
            <tr>
              <td>
                <div class="service-name">${service.name}${qty > 1 ? ` (x${qty})` : ''}</div>
                <div class="service-desc">${service.description}</div>
                <div class="service-why">${service.whyNeeded}</div>
                <ul class="benefits-list">
                  ${service.benefits.map((b) => `<li>${b}</li>`).join('')}
                </ul>
              </td>
              <td>${formatPriceUnit(service.priceUnit)}</td>
              <td class="price">
                ${formatPrice(price)}
              </td>
            </tr>
          `;
              }
            )
            .join('')}
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotale una tantum</span>
        <span>${formatPrice(data.total)}</span>
      </div>
      ${discount > 0 ? `
        <div class="total-row discount">
          <span>Sconto ${discount}%${data.discountReason ? ` (${data.discountReason})` : ''}</span>
          <span>-${formatPrice(data.total * discount / 100)}</span>
        </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>Totale</span>
        <span>${formatPrice(discountedTotal)}</span>
      </div>
      ${data.recurring > 0 ? `
        <div class="recurring-note">
          <strong>Costi ricorrenti:</strong> ${formatPrice(data.recurring)} /periodo
          <br><small>I costi ricorrenti includono servizi con fatturazione mensile, trimestrale o annuale.</small>
        </div>
      ` : ''}
    </div>
  </div>

  ${data.paymentTerms ? `
    <div class="section">
      <h2 class="section-title">Condizioni di Pagamento</h2>
      <p>${data.paymentTerms}</p>
    </div>
  ` : ''}

  ${data.clientNotes ? `
    <div class="section">
      <h2 class="section-title">Note</h2>
      <div class="notes-section">
        ${data.clientNotes.replace(/\n/g, '<br>')}
      </div>
    </div>
  ` : ''}

  <div class="footer">
    <p><strong>Metis Web Agency</strong></p>
    <p>Email: info@metiswebagency.it | Web: www.metiswebagency.it</p>
    <p style="margin-top: 10px;">
      Questo preventivo è stato generato automaticamente ed è valido per ${data.validityDays} giorni dalla data di emissione.
      I prezzi indicati sono al netto di IVA. Per accettazione, rispondere a questa email o contattarci.
    </p>
  </div>

  <button class="print-button no-print" onclick="window.print()">
    Salva come PDF
  </button>
</body>
</html>`;
}
