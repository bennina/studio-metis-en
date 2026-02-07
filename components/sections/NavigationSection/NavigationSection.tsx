// components/sections/NavigationSection/NavigationSection.tsx
"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Section, Container, Button } from "@/components/atoms";
import {
  NavItems,
  SocialLink,
  SocialLinkProps,
  type NavItemProps,
} from "@/components/molecules";
import {
  FacebookIcon,
  Instagram,
  Linkedin,
  X,
  Youtube,
  MessageCircle,
} from "lucide-react";
import {
  getNavigationSectionClasses,
  type NavigationLayout,
  type StickyMode,
} from "./NavigationSection.style";

export interface NavigationTopBarConfig {
  variant?: "nav" | "banner";
  /**
   * IMPORTANT (RSC): NavigationSection è un Client Component.
   * Tutte le props devono essere serializzabili: niente ReactNode.
   */
  text?: string;
  items?: NavigationNavItem[];
  socialLinks?: NavigationSocialLink[];
}

/**
 * Item serializzabile per la navigazione (safe per Server -> Client).
 */
export interface NavigationNavItem {
  href: string;
  label: string;
  active?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export type NavigationSocialIconName =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "x"
  | "youtube"
  | "whatsapp";

export interface NavigationSocialLink {
  href: string;
  label?: string;
  icon?: NavigationSocialIconName;
  newTab?: boolean;
}

export interface NavigationLogo {
  src: string;
  alt: string;
  href?: string;
  width?: number;
  height?: number;
  className?: string;
}

export interface NavigationSectionProps {
  /**
   * IMPORTANT (RSC): deve essere serializzabile perché NavigationSection è Client Component.
   * Niente ReactNode / componenti come prop.
   */
  logo: NavigationLogo;
  primaryNavItems?: NavigationNavItem[];
  socialLinks?: SocialLinkProps[];

  ctaLabel?: string;
  /** es. '#contatti' o '/contatti' */
  ctaHref?: string;

  layout?: NavigationLayout;
  stickyMode?: StickyMode;
  topBar?: NavigationTopBarConfig;
  showBurgerOnDesktop?: boolean;
  simplified?: boolean;

  className?: string;
}

/**
 * NavigationSection
 *
 * - Top bar (nav secondaria o banner)
 * - Layout:
 *   - logo-only
 *   - inline
 *   - burger
 *   - inline-with-burger
 * - Sticky: none | always | mobile
 *
 * - Allo scroll:
 *   - trasparente in top page
 *   - con bg + blur + bordo dopo una certa soglia
 */
export const NavigationSection: FC<NavigationSectionProps> = ({
  logo,
  primaryNavItems,
  socialLinks,
  ctaLabel,
  ctaHref,
  layout = "inline-with-burger",
  stickyMode = "always",
  topBar,
  showBurgerOnDesktop = layout === "burger" ? true : false,
  simplified = false,
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestione scroll → applica background quando non sei più in cima alla pagina
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    handleScroll(); // per aggiornare subito se si entra già scrolled
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hasTopBar = !!(
    topBar &&
    (topBar.text ||
      (topBar.items && topBar.items.length > 0) ||
      (topBar.socialLinks && topBar.socialLinks.length > 0))
  );

  const classes = getNavigationSectionClasses({
    stickyMode,
    hasTopBar,
  });

  const showInlineNav =
    !simplified && (layout === "inline" || layout === "inline-with-burger");

  const showBurger =
    !simplified && (layout === "burger" || layout === "inline-with-burger");

  const burgerVisibleOn = showBurgerOnDesktop ? "flex" : "flex md:hidden";

  const hasCta = !!ctaLabel && !simplified;

  const toNavItemProps = (items?: NavigationNavItem[]): NavItemProps[] => {
    if (!items || items.length === 0) return [];
    // NavItems accetta label come ReactNode, quindi una stringa va benissimo.
    // Castiamo al tipo NavItemProps per evitare dipendenze dal model interno.
    return items.map((i) => ({
      href: i.href,
      label: i.label,
      active: i.active,
      target: i.target,
    })) as unknown as NavItemProps[];
  };

  const getSocialIcon = (name?: NavigationSocialIconName): ReactNode => {
    switch (name) {
      case "facebook":
        return <FacebookIcon />;
      case "instagram":
        return <Instagram />;
      case "linkedin":
        return <Linkedin />;
      case "x":
        return <X />;
      case "youtube":
        return <Youtube />;
      case "whatsapp":
        return <MessageCircle />;
      default:
        return null;
    }
  };

  const renderLogo = () => {
    const href = logo.href ?? "/";

    return (
      <a href={href} className="inline-flex items-center min-w-0">
        <img
          src={logo.src}
          alt={logo.alt}
          width={logo.width ?? 200}
          height={logo.height ?? 32}
          className={logo.className}
          loading="eager"
        />
      </a>
    );
  };

  // background dinamico allo scroll
  const scrollBgClass = isScrolled
    ? "bg-neutral-100/30 backdrop-blur-xl rounded-full border-b border-neutral-100 py-0 mt-5"
    : "bg-transparent";

  const wrapperClassName = [classes.wrapper, className]
    .filter(Boolean)
    .join(" ");

  // ────────────────────────────────────────────────
  //  Helpers UI
  // ────────────────────────────────────────────────

  const renderTopBar = () => {
    if (!hasTopBar || !topBar) return null;

    const isNavTopBar = topBar.variant === "nav";

    return (
      <div className={classes.topBar}>
        {isNavTopBar ? (
          <>
            <div className="flex items-center gap-6">
              {topBar.items && topBar.items.length > 0 && (
                <NavItems
                  items={toNavItemProps(topBar.items)}
                  className="gap-6 text-[11px]"
                />
              )}
            </div>
            <div className="flex items-center gap-6">
              {topBar.socialLinks?.map((social) => (
                <SocialLink
                  key={`${social.href}-${String(social.label ?? "")}`}
                  href={social.href}
                  label={social.label}
                  newTab={social.newTab ?? true}
                  icon={getSocialIcon(social.icon)}
                  //@ts-expect-error
                  variant={social?.variant || "outline"}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="truncate">{topBar.text}</div>
            <div className="flex items-center gap-6">
              {topBar.socialLinks?.map((social) => (
                <SocialLink
                  key={`${social.href}-${String(social.label ?? "")}`}
                  href={social.href}
                  label={social.label}
                  newTab={social.newTab ?? true}
                  icon={getSocialIcon(social.icon)}
                  //@ts-expect-error
                  variant={social?.variant || "outline"}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderBurgerButton = () => {
    if (!showBurger) return null;

    return (
      <button
        type="button"
        className={[
          "grid",
          "items-center",
          "justify-center",

          "h-5",

          "transition-colors",
          "duration-150",
        ].join(" ")}
        aria-label={isMenuOpen ? "Chiudi menu" : "Apri menu"}
        aria-expanded={isMenuOpen}
        aria-controls="nav-menu-overlay"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <div
          className={[
            "items-center",
            "justify-center",
            isMenuOpen ? "w-5" : "w-1",
            isMenuOpen ? "-rotate-45 mt-3" : "",
            "h-1",

            "transition-all",
            "duration-150",
            isMenuOpen
              ? "bg-primary-600"
              : "bg-[var(--color-primary-700)]",
          ].join(" ")}
        ></div>
        <div
          className={[
            "items-center",
            "justify-center",
            isMenuOpen ? "w-0" : "w-1",
            "h-1",
            "transition-all",
            "duration-150",
            isMenuOpen
              ? "bg-primary-600"
              : "bg-[var(--color-primary-700)]",
          ].join(" ")}
        ></div>
        <div
          className={[
            "items-center",
            "justify-center",
            isMenuOpen ? "w-5" : "w-1",
            isMenuOpen ? "rotate-45 -mt-3" : "",
            "h-1",

            "transition-all",
            "duration-150",
            isMenuOpen
              ? "bg-primary-600"
              : "bg-[var(--color-primary-700)]",
          ].join(" ")}
        ></div>
      </button>
    );
  };

  const renderInlineNav = () => {
    if (!showInlineNav || !primaryNavItems || primaryNavItems.length === 0) {
      return null;
    }

    return (
      <NavItems
        items={toNavItemProps(primaryNavItems)}
        className="hidden md:flex"
      />
    );
  };

  const renderCta = () => {
    if (!hasCta) return null;

    if (ctaHref) {
      return (
        <div className="hidden md:flex">
          <Button size="sm" variant={"outlinePrimary"} href={ctaHref}>
            {ctaLabel}
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex">
        <Button size="sm">{ctaLabel}</Button>
      </div>
    );
  };

  const renderSocialLinks = () => {
    if (!socialLinks || socialLinks.length === 0 || simplified) return null;

    return (
      <div className="hidden md:flex items-center gap-6">
        {socialLinks.map((social) => (
          <SocialLink
            key={`${social.href}-${String(social.label ?? "")}`}
            {...social}
            variant={social?.variant || "outline"}
          />
        ))}
      </div>
    );
  };

  const renderMainBar = () => {
    return (
      <div className={classes.mainBar}>
        <div className="flex items-center gap-6 min-w-0">{renderLogo()}</div>

        {renderInlineNav()}

        <div className="flex items-center gap-6">
          {renderSocialLinks()}
          {renderCta()}
          {renderBurgerButton()}
        </div>
      </div>
    );
  };

  const renderOverlayMenu = () => {
    if (!showBurger) return null;

    const hasOverlayContent =
      (primaryNavItems && primaryNavItems.length > 0) ||
      hasCta ||
      (socialLinks && socialLinks.length > 0);

    if (!hasOverlayContent) return null;

    return (
      <div
        id="nav-menu-overlay"
        className={[
          "fixed inset-x-0 top-0 z-40",
          "bg-neutral-100/30",
          "backdrop-blur-xl",
          "border-b",
          "border-neutral-800",
          "transition-all",
          "duration-200",
          isMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0 h-screen px-6 py-4"
            : "opacity-0 pointer-events-none -translate-y-2",
        ].join(" ")}
      >
        <Container>
          <div className={classes.mainBar}>
            <div className="flex items-center gap-6 min-w-0">
              {renderLogo()}
            </div>

            <div className="flex items-center gap-6">
              {renderBurgerButton()}
            </div>
          </div>

          <div className="py-12">
            {primaryNavItems && primaryNavItems.length > 0 && (
              <nav>
                <ul className="flex flex-col gap-8 text-base">
                  {primaryNavItems.map((item) => (
                    <li key={`${item.href}-${String(item.label)}`}>
                      <NavItemOverlay
                        {...item}
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-6 pt-6 border-t border-neutral-800">
              {socialLinks.map((social) => (
                <SocialLink
                  key={`${social.href}-${String(social.label ?? "")}`}
                  {...social}
                  variant="outline"
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    );
  };

  return (
    <Section as="header" paddingY="none" className={wrapperClassName}>
      {hasTopBar && <Container>{renderTopBar()}</Container>}

      <Container
        className={[scrollBgClass, "transition-all duration-150"].join(" ")}
      >
        {renderMainBar()}
      </Container>

      {renderOverlayMenu()}
    </Section>
  );
};

interface NavItemOverlayProps extends NavigationNavItem {
  onClick?: () => void;
}

const NavItemOverlay: FC<NavItemOverlayProps> = ({
  href,
  label,
  active,
  onClick,
}) => {
  return (
    <a
      href={href}
      className={[
        "text-base",
        "font-medium",
        "tracking-[0.08em]",
        "uppercase",
        "text-primary-900",
        "hover:text-[var(--color-primary-500)]",
        active ? "text-[var(--color-primary-500)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {label}
    </a>
  );
};
