-- lib/db/migrations/001_quotes.sql
-- Schema per il salvataggio dei preventivi

CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(50) NOT NULL UNIQUE,

  -- Dati cliente
  company_name VARCHAR(255),
  project_name VARCHAR(255),
  sector VARCHAR(100),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),

  -- Totali
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_reason VARCHAR(255),
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  recurring DECIMAL(10, 2) DEFAULT 0,

  -- Servizi selezionati (JSON)
  selected_site_type VARCHAR(100),
  selected_services JSON,

  -- Condizioni
  validity_days INT DEFAULT 30,
  payment_terms TEXT,

  -- Note
  client_notes TEXT,
  internal_notes TEXT,

  -- Stato
  status ENUM('draft', 'sent', 'approved', 'rejected', 'expired') DEFAULT 'draft',
  approved_at DATETIME,
  approved_by VARCHAR(255),

  -- Metadati
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sent_at DATETIME,
  pdf_url VARCHAR(500),

  -- Indici
  INDEX idx_quote_number (quote_number),
  INDEX idx_company_name (company_name),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
