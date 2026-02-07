// components/atoms/Title/Title.tsx
import type { FC, ReactNode } from "react";
import {
  getTitleClasses,
  type TitleVariant,
  type TitleTone,
} from "./Title.style";

export interface TitleProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  variant?: TitleVariant;
  tone?: TitleTone;
  className?: string;
  children?: ReactNode;

  /**
   * Contenuto HTML (es. proveniente da JSON/CMS).
   * Ha priorità su `children`.
   * ATTENZIONE: assicurati che sia già sanificato se arriva da input esterno.
   */
  html?: string;
}

export const Title: FC<TitleProps> = ({
  as,
  variant = "h2",
  tone,
  className = "",
  children,
  html,
}) => {
  const Component =
    as ??
    (variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : variant === "h4"
      ? "h4"
      : variant === "h5"
      ? "h5"
      : "h6");

  const classes = getTitleClasses({ variant, tone });
  const mergedClassName = [classes.root, className].filter(Boolean).join(" ");

  
    return (
      <Component
        className={mergedClassName}
        dangerouslySetInnerHTML={{ __html: children ? String(children) : (html ?? "") }}
      />
    );
  

  
};
