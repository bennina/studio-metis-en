// lib/siteLayoutConfig.tsx
import type {
  NavigationSectionProps,
  NavigationSocialLink,
} from "@/components/sections/NavigationSection";
import type { FooterSectionProps } from "@/components/sections/FooterSection";
import { Image, Paragraph } from "@/components/atoms";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SocialLinkProps } from "@/components";

/**
 * Layout shared (navigation + footer) per tutte le pagine JSON.
 *
 * Nota:
 * - Manteniamo questi config in codice (non nel JSON) per evitare di dover serializzare ReactNode (icone, loghi).
 * - CTA e voci menu sono sempre URL reali (/... o /#anchor) così gli <a href> compaiono nel DOM (SEO-friendly).
 */

const socialLinks: SocialLinkProps[] = [
  {
    href: "https://www.instagram.com/metiswebagency/",
    label: "Instagram",
    icon: <Instagram />,
  },
  {
    href: "https://www.facebook.com/MetisWebAgency",
    label: "facebook",
    icon: <Facebook />,
  },
  {
    href: "https://www.linkedin.com/company/metis-web-agency",
    label: "linkedin",
    icon: <Linkedin />,
  },
  {
    href: "https://metiswebagency.com/",
    label: "EN",
    variant: "pill",
  },
];

export const navigationConfig: NavigationSectionProps = {
  // IMPORTANT: serializzabile (NavigationSection è un Client Component)
  logo: {
    src: "/images/logo.svg",
    alt: "Metis web agency | Consulenza Digitale e Sviluppo Web",
    width: 70,
    height: 100,
  },
  layout: "burger",
  stickyMode: "always",
  primaryNavItems: [
    { href: "/chi-siamo", label: "Chi Siamo" },
    { href: "/servizi", label: "Servizi" },
    { href: "/pacchetti", label: "Pacchetti" },
    { href: "/metodo", label: "Come lavoriamo" },
    { href: "/risorse", label: "Risorse" },
    { href: "/contatti", label: "Contatti" },
  ],
  socialLinks: socialLinks,
  ctaLabel: "Contattaci",
  ctaHref: "/contatti",
};

export const footerConfig: FooterSectionProps = {
  company: {
    name: "Metis web agency | Consulenza Digitale e Sviluppo Web",
    logo: (
      <>
        <Image
          src="/images/logo.svg"
          alt="Metis web agency di Elisabetta Monaco | Consulenza Digitale e Sviluppo Web"
          width={70}
          height={32}
        />
        <Paragraph html={'di <b>Elisabetta Monaco</b>'} />
      </>
    ),
    vat: "P.IVA 02876000841",
    addressLines: [
      "<b>Sede operativa: </b>Via Mongitore, 40 - Menfi (AG) </br><b>Sede legale: </b>Via garibaldi, 56 - Menfi (AG) </br> 92013 Sicilia – Italia",
    ],
    contacts: [
      <>
        <b className="tracking-[1px]">Email:</b>{" "}
        <a
          className="text-primary-600"
          href="mailto:info@metiswebagency.it"
        >
          info@metiswebagency.it
        </a>
      </>,
      <>
        <b className="tracking-[1px]">Tel:</b>{" "}
        <a className="text-primary-600" href="tel:+393494459317">
          +39 3494459317
        </a>
      </>,
      <>
        <b className="tracking-[1px]">Ufficio:</b>{" "}
        <a className="text-primary-600" href="tel:+390925969901">
          0925 969901
        </a>
      </>,
    ],
  },
  socialLinks: socialLinks,
  secondaryLinks: [
    {
      href: "https://www.iubenda.com/privacy-policy/26089082",
      target: "_blank",
      label: "Privacy policy",
    },
    {
      href: "https://www.iubenda.com/privacy-policy/26089082/cookie-policy",
      target: "_blank",
      label: "Cookie policy",
    },
    {
      href: "https://www.metiswebagency.it/",
      target: "_blank",
      label: "Metis web agency",
    },
  ],
};
