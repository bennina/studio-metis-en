"use client";
// components/sections/FooterSection/FooterSection.tsx
import type { FC, ReactNode } from 'react';
import { Section, Container, Paragraph } from "@/components/atoms";
import { SocialLink, type SocialLinkProps } from "@/components/molecules";
import { getFooterSectionClasses } from './FooterSection.style';

export interface FooterLink {
  label: ReactNode;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface FooterColumn {
  title?: ReactNode;
  links?: FooterLink[];
}

export interface FooterCompanyInfo {
  name?: ReactNode;
  vat?: ReactNode;
  addressLines?: ReactNode[];
  contacts?: ReactNode[];
  extra?: ReactNode;
  logo?: ReactNode;
}

export interface FooterSectionProps {
  company?: FooterCompanyInfo;
  columns?: FooterColumn[];
  socialLinks?: SocialLinkProps[];

  /** Testo copybar (default: © anno + Metis web agency) */
  copy?: ReactNode;

  /** Link in copybar (es. Privacy, Cookie policy) */
  secondaryLinks?: FooterLink[];

  /** Versione semplificata: solo company + copybar */
  simplified?: boolean;

  className?: string;
}

/**
 * FooterSection
 *
 * - Dati aziendali (nome, P.IVA, indirizzo, contatti)
 * - Colonne di link (servizi, risorse, legali...)
 * - Social
 * - Copybar con copyright + privacy/cookie
 */
export const FooterSection: FC<FooterSectionProps> = ({
  company,
  columns,
  socialLinks,
  copy,
  secondaryLinks,
  simplified = false,
  className = '',
}) => {
  const hasTopArea = !!(
    company ||
    (!simplified && columns && columns.length > 0) ||
    (!simplified && socialLinks && socialLinks.length > 0)
  );

  const classes = getFooterSectionClasses({ hasTopArea });

  const wrapperClassName = [classes.wrapper, className]
    .filter(Boolean)
    .join(' ');

  const year = new Date().getFullYear();

  const defaultCopy = (
    <span>
      Metis Web Agency di <b>Elisabetta Monaco</b> – {company?.vat} | © {year} All rights reserved.
    </span>
  );

  return (
    <Section
      as="footer"
      paddingY="lg"
      
      className={wrapperClassName}
    >
      <Container>
        {hasTopArea && (
          <div className={classes.topArea}>
            <div className={classes.innerGrid}>
              {/* Blocco dati aziendali */}
              {company && (
                <div className={classes.companyBlock}>
                  {company.logo ?? (
                    company.name && (
                      <div className={classes.companyName}>
                        {company.name}
                      </div>
                    )
                  )}

                  {company.addressLines && company.addressLines.length > 0 && (
                    <div className="py-6">
                      {company.addressLines.map((line, index) => (
                        <Paragraph key={index}>{line}</Paragraph>
                      ))}
                    </div>
                  )}

                  {company.contacts && company.contacts.length > 0 && (
                    <div className="grid gap-2 mt-2">
                      {company.contacts.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  )}

                  {company.extra && (
                    <Paragraph className="mt-2">
                      {company.extra}
                    </Paragraph>
                  )}

                  {company.vat && (
                    <div> {company.vat} </div> 
                  )}
                </div>
              )}

              {/* Colonne + social (saltate se simplified) */}
              {!simplified && (
                <div className="space-y-12">
                  {columns && columns.length > 0 && (
                    <div className={classes.columnsGrid}>
                      {columns.map((col, index) => (
                        <Paragraph key={index}>
                          {col.title && (
                            <div className={classes.columnTitle}>
                              {col.title}
                            </div>
                          )}
                          {col.links && col.links.length > 0 && (
                            <div className="space-y-0.5">
                              {col.links.map((link) => (
                                <a
                                  key={`${link.href}-${String(link.label)}`}
                                  href={link.href}
                                  className={classes.link}
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </Paragraph>
                      ))}
                    </div>
                  )}

                  {socialLinks && socialLinks.length > 0 && (
                    <div className={classes.socialRow}>
                      {socialLinks.map((social) => (
                        <SocialLink
                          key={`${social.href}-${String(social.label ?? '')}`}
                          {...social}
                          size="sm"
                          variant={social.variant || "outline"}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Copybar */}
        <div className={classes.bottomBar}>
          <div>
            {copy ?? defaultCopy}
          </div>

          {secondaryLinks && secondaryLinks.length > 0 && (
            <div className={classes.bottomLinks}>
              {secondaryLinks.map((link) => (
                <a
                  key={`${link.href}-${String(link.label)}`}
                  href={link.href}
                  target={link.target ?? '_self'}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="hover:text-primary-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};
