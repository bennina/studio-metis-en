// components/layout/PageWrapper.tsx
import type { FC, ReactNode } from "react";

// NOTE: importiamo i componenti direttamente dai file per evitare problemi con barrel exports
// (circular deps / componenti undefined).
import {
  NavigationSection,
  type NavigationSectionProps,
} from "../sections/NavigationSection/NavigationSection";
import { FooterSection, type FooterSectionProps } from "../sections/FooterSection/FooterSection";
import { CoverSection, type CoverSectionProps } from "../sections/CoverSection/CoverSection";
import {
  SimpleContentSection,
  type SimpleContentSectionProps,
} from "../sections/SimpleContentSection/SimpleContentSection";
import { TextMediaSection, type TextMediaSectionProps } from "../sections/TextMediaSection/TextMediaSection";
import { WallCardSection, type WallCardSectionProps } from "../sections/WallCardSection/WallCardSection";
import { FormCardSection, type FormCardSectionProps } from "../sections/FormCardSection/FormCardSection";
import { QuizCardSection, type QuizCardSectionProps } from "../sections/QuizCardSection/QuizCardSection";


export type PageVariant = "default" | "landing";

/**
 * Ogni entry dell'array "sections" dice:
 * - quale componente usare (type)
 * - con quali props (props)
 */
export type PageSectionConfig =
  | {
      type: "cover";
      props: CoverSectionProps;
    }
  | {
      type: "simple-content";
      props: SimpleContentSectionProps;
    }
  | {
      type: "text-media";
      props: TextMediaSectionProps;
    }
  | {
      type: "wall-card";
      props: WallCardSectionProps;
    }
  | {
      type: "form-card";
      props: FormCardSectionProps;
  }
  | {
      type: "quiz-card";
      props: QuizCardSectionProps;
    };

export interface PageWrapperProps {
  /** default: "default" – "landing" usa header/footer semplificati */
  variant?: PageVariant;

  /** Config per la NavigationSection. Metti false per nasconderla. */
  navigation?: NavigationSectionProps | false;

  /** Config per il FooterSection. Metti false per nasconderlo. */
  footer?: FooterSectionProps | false;

  /** Sezioni della pagina, renderizzate dinamicamente */
  sections: PageSectionConfig[];

  /** Classi extra per <main> */
  className?: string;

  /** Slot opzionale per contenuti fuori dallo schema (es. modali globali) */
  children?: ReactNode;
}

/**
 * PageWrapper
 *
 * - monta header/footer in automatico
 * - gestisce variant "default" vs "landing" (semplificata)
 * - rende le sezioni in base a "sections"
 */
export const PageWrapper: FC<PageWrapperProps> = ({
  variant = "default",
  navigation,
  footer,
  sections,
  className = "",
  children,
}) => {
  const isLanding = variant === "landing";

  // ─────────────────────────────
  // Navigation
  // ─────────────────────────────
  let navigationProps: NavigationSectionProps | null = null;

  if (navigation) {
    // Qui TS sa che navigation è NavigationSectionProps
    navigationProps = {
      ...navigation,
      // se landing, forziamo simplified a true; altrimenti rispettiamo il valore passato
      simplified: isLanding ? true : navigation.simplified,
    };
  }

  // ─────────────────────────────
  // Footer
  // ─────────────────────────────
  let footerProps: FooterSectionProps | null = null;

  if (footer) {
    footerProps = {
      ...footer,
      simplified: isLanding ? true : footer.simplified,
    };
  }

  const mainClassName = [className].filter(Boolean).join("");

  const renderSection = (section: PageSectionConfig, index: number) => {
    const key =
      // se la section ha un id nei props, usiamolo come key
      (section.props as any)?.id ?? `${section.type}-${index}`;

    switch (section.type) {
      case "cover":
        return <CoverSection key={key} {...section.props} ></CoverSection>;

      case "simple-content":
        return <SimpleContentSection key={key} {...section.props} />;

      case "text-media":
        return <TextMediaSection key={key} {...section.props} />;

      case "wall-card":
        return <WallCardSection key={key} {...section.props} />;

      case "form-card":
        return <FormCardSection key={key} {...section.props} />;
      case "quiz-card":
        return <QuizCardSection key={key} {...section.props} />;
      default:
        return null;
    }
  };

  return (
    <>
      {navigationProps && <NavigationSection {...navigationProps} />}
      <main id="main-content" className={'absolute top-0 w-full'} tabIndex={-1}>
        {sections.map(renderSection)}

        {children}
        {footerProps && <FooterSection {...footerProps} />}
      </main>
      
    </>
  );
};
