// lib/db/quotes.ts
// Database operations for quotes

import { getDbPool } from "@/lib/db";
import type { BriefData } from "@/lib/brief/briefTypes";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface QuoteRecord {
  id: number;
  quote_number: string;
  company_name: string | null;
  project_name: string | null;
  sector: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  subtotal: number;
  discount_percent: number;
  discount_reason: string | null;
  total: number;
  recurring: number;
  selected_site_type: string | null;
  selected_services: string;
  validity_days: number;
  payment_terms: string | null;
  client_notes: string | null;
  internal_notes: string | null;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  approved_at: Date | null;
  approved_by: string | null;
  created_at: Date;
  updated_at: Date;
  sent_at: Date | null;
  pdf_url: string | null;
}

/**
 * Genera un numero preventivo univoco
 * Formato: PREV-ANNO-NUMERO (es: PREV-2026-00001)
 */
export async function generateQuoteNumber(): Promise<string> {
  const pool = getDbPool();
  const year = new Date().getFullYear();
  const prefix = `PREV-${year}-`;

  // Trova l'ultimo numero del preventivo per quest'anno
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT quote_number FROM quotes
     WHERE quote_number LIKE ?
     ORDER BY id DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let nextNumber = 1;
  if (rows.length > 0) {
    const lastNumber = rows[0].quote_number as string;
    const lastNum = parseInt(lastNumber.replace(prefix, ""), 10);
    nextNumber = lastNum + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(5, "0")}`;
}

/**
 * Salva un nuovo preventivo nel database
 */
export async function saveQuote(
  briefData: BriefData,
  quoteNumber: string
): Promise<number> {
  const pool = getDbPool();
  const discount = briefData.discountPercent || 0;
  const discountedTotal = briefData.total * (1 - discount / 100);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO quotes (
      quote_number,
      company_name,
      project_name,
      sector,
      contact_name,
      contact_email,
      contact_phone,
      subtotal,
      discount_percent,
      discount_reason,
      total,
      recurring,
      selected_site_type,
      selected_services,
      validity_days,
      payment_terms,
      client_notes,
      internal_notes,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')`,
    [
      quoteNumber,
      briefData.clientInfo.companyName || null,
      briefData.clientInfo.projectName || null,
      briefData.clientInfo.sector || null,
      briefData.clientInfo.contactName || null,
      briefData.clientInfo.contactEmail || null,
      briefData.clientInfo.contactPhone || null,
      briefData.total,
      discount,
      briefData.discountReason || null,
      discountedTotal,
      briefData.recurring,
      briefData.selectedSiteType || null,
      JSON.stringify(briefData.selectedServices),
      briefData.validityDays,
      briefData.paymentTerms || null,
      briefData.clientNotes || null,
      briefData.internalNotes || null,
    ]
  );

  return result.insertId;
}

/**
 * Recupera un preventivo per ID
 */
export async function getQuoteById(id: number): Promise<QuoteRecord | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM quotes WHERE id = ?",
    [id]
  );

  if (rows.length === 0) return null;
  return rows[0] as QuoteRecord;
}

/**
 * Recupera un preventivo per numero
 */
export async function getQuoteByNumber(
  quoteNumber: string
): Promise<QuoteRecord | null> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM quotes WHERE quote_number = ?",
    [quoteNumber]
  );

  if (rows.length === 0) return null;
  return rows[0] as QuoteRecord;
}

/**
 * Aggiorna lo stato di un preventivo
 */
export async function updateQuoteStatus(
  id: number,
  status: QuoteRecord["status"],
  approvedBy?: string
): Promise<void> {
  const pool = getDbPool();
  const updates: string[] = ["status = ?"];
  const params: (string | Date | number)[] = [status];

  if (status === "approved" && approvedBy) {
    updates.push("approved_at = NOW()");
    updates.push("approved_by = ?");
    params.push(approvedBy);
  }

  params.push(id);
  await pool.query(`UPDATE quotes SET ${updates.join(", ")} WHERE id = ?`, params);
}

/**
 * Segna un preventivo come inviato
 */
export async function markQuoteAsSent(id: number): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    "UPDATE quotes SET status = 'sent', sent_at = NOW() WHERE id = ?",
    [id]
  );
}

/**
 * Lista preventivi con paginazione
 */
export async function listQuotes(options: {
  page?: number;
  limit?: number;
  status?: QuoteRecord["status"];
}): Promise<{ quotes: QuoteRecord[]; total: number }> {
  const pool = getDbPool();
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  let whereClause = "";
  const params: (string | number)[] = [];

  if (options.status) {
    whereClause = "WHERE status = ?";
    params.push(options.status);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM quotes ${whereClause}`,
    params
  );

  params.push(limit, offset);
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM quotes ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  return {
    quotes: rows as QuoteRecord[],
    total: (countRows[0] as { total: number }).total,
  };
}
