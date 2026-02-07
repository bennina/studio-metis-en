// schema/mapSchemaToConfig.ts

import type { ReactNode } from "react";
import type {
  PageSchema,
  SectionSchema,
  SimpleContentSectionSchema,
  TextMediaSectionSchema,
  CoverSectionSchema,
  WallCardSectionSchema,
  FormCardSectionSchema,
  QuizCardSectionSchema,
} from "./pageSchema";

import type { PageSectionConfig } from "@/components/layout/PageWrapper";

// se in futuro hai un registry di icone, mappa iconName -> ReactNode qui
function resolveIcon(name?: string): ReactNode | undefined {
  if (!name) return undefined;
  // TODO: implementa la mappa (es. "chart" -> <ChartIcon />)
  return undefined;
}

function mapSimpleContentSection(
  section: SimpleContentSectionSchema,
): PageSectionConfig {
  const { id, background, paddingY, content, primaryCta, secondaryCta } =
    section;

  return {
    type: "simple-content",
    props: {
      id,
      background: (background as any) ?? "default",
      paddingY: (paddingY as any) ?? "xl",
      width: "normal",
      align: "left",
      eyebrow: content?.eyebrow,
      tone: content?.tone,
      title: content?.title,
      subtitle: content?.subtitle,
      columns: content?.columns,
      body: content?.body,
      primaryCtaLabel: primaryCta?.label,
      primaryCtaHref: primaryCta?.href,
      secondaryCtaLabel: secondaryCta?.label,
      secondaryCtaHref: secondaryCta?.href,
      accordions: content?.accordions?.map((a, index) => ({
        key: `faq-${index}-${(a?.title || "item")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`,
        title: a.title,
        description: a.description,
        content: a.content,
        defaultOpen: a.defaultOpen,
      })),
    },
  };
}

function mapTextMediaSection(
  section: TextMediaSectionSchema,
): PageSectionConfig {
  const { id, background, content, media, layout, primaryCta, secondaryCta } =
    section;

  return {
    type: "text-media",

    props: {
      id,
      background: (background as any) ?? "default",
      paddingY: (layout?.paddingY as any) ?? "lg",
      width: layout?.width ?? "normal",
      textAlignY: layout?.textAlignY ?? "top",
      mediaPosition: layout?.mediaPosition ?? "right",
      alignText: layout?.alignText ?? "left",
      media: {
        src: media?.src,
        alt: media?.alt,
        ratio: media?.aspectRatio ?? "4:3",
      },

      eyebrow: content?.eyebrow,
      title: content?.title,
      subtitle: content?.subtitle,
      columns: content?.columns,
      body: content?.body,
      primaryCtaLabel: primaryCta?.label,
      primaryCtaHref: primaryCta?.href,
      secondaryCtaLabel: secondaryCta?.label,
      secondaryCtaHref: secondaryCta?.href,
    },
  };
}

function mapCoverSection(section: CoverSectionSchema): PageSectionConfig {
  const {
    id,
    background,
    backgroundImage,
    layout,
    content,
    primaryCta,
    secondaryCta,
  } = section;

  return {
    type: "cover",
    props: {
      id,
      className: "",
      backgroundImage: backgroundImage && {
        src: backgroundImage.src,
        alt: backgroundImage.alt,
      },
      paddingY: (layout?.paddingY as any) ?? "lg",
      radius: layout?.radius ?? "none",
      background: (background as any) ?? "default",
      withOverlay: layout?.withOverlay ?? false,
      overlayClassName: "",
      alignX: layout?.alignX ?? "left",
      alignY: layout?.alignY ?? "center",
      height: layout?.height ?? "lg",
      contentVariant: layout?.contentVariant ?? "card",
      tone: content?.tone,
      //@ts-expect-error
      eyebrow: content?.eyebrow,
      columns: content?.columns,
      isFirst: content?.isFirst,
      title: content?.title,
      subtitle: content?.subtitle,
      body: content?.body,
      primaryCtaLabel: primaryCta?.label,
      primaryCtaHref: primaryCta?.href,
      secondaryCtaLabel: secondaryCta?.label,
      secondaryCtaHref: secondaryCta?.href,
    },
  };
}

function mapWallCardSection(section: WallCardSectionSchema): PageSectionConfig {
  const {
    id,
    background,
    paddingY,
    header,
    layout,
    items,
    primaryCta,
    secondaryCta,
  } = section;

  return {
    type: "wall-card",
    props: {
      id,
      background: (background as any) ?? "default",
      paddingY: (paddingY as any) ?? "xl",
      align: layout?.align ?? "left",
      columnsMobile: layout?.columnsMobile ?? 1,
      columnsDesktop: layout?.columnsDesktop ?? 3,
      cardVariant: layout?.cardVariant ?? "primary",
      gap: layout?.gap ?? "md",
      eyebrow: header?.eyebrow,
      tone: header?.tone,
      title: header?.title,
      subtitle: header?.subtitle,
      headerBody: header?.body,
      headerColumns: header?.columns,
      ctaPlacement: layout?.ctaPlacement ?? "footer",
      primaryCtaLabel: primaryCta?.label,
      primaryCtaHref: primaryCta?.href,
      secondaryCtaLabel: secondaryCta?.label,
      secondaryCtaHref: secondaryCta?.href,
      items: items.map((item) => ({
        id: item.id,
        eyebrow: item.eyebrow,
        title: item.title,
        subtitle: item.subtitle,
        media: {
          src: item?.media?.src as string | undefined,
          alt: item?.media?.alt as string | undefined,
        } as any,
        meta: {
          priceLabel: item.meta?.priceLabel,
          priceValue: item.meta?.priceValue,
        },
        description: item.description,
        icon: resolveIcon(item.iconName),
        ctaLabel: item.cta?.label,
        ctaHref: item.cta?.href,
      })),
    },
  };
}

function mapFormCardSection(section: FormCardSectionSchema): PageSectionConfig {
  const {
    id,
    background,
    backgroundImage,
    layout,
    content,
    fields,
    form,
    submitLabel,
    primaryCta,

    secondaryText,
    formAction,
    formMethod,
  } = section;

  return {
    type: "form-card",
    props: {
      id,
      background: (background as any) ?? "default",
      backgroundImage: backgroundImage && {
        src: backgroundImage.src,
        alt: backgroundImage.alt,
      },
      withOverlay: layout?.withOverlay ?? false,
      overlayClassName: "",
      alignX: layout?.alignX ?? "right",
      alignY: layout?.alignY ?? "center",
      height: layout?.height ?? "md",
      eyebrow: content?.eyebrow,
      title: content?.title,
      radius: layout?.radius,
      tone: content?.tone,
      subtitle: content?.subtitle,
      description: content?.description,
      form: {
        eyebrow: form?.eyebrow,
        title: form?.title,
        description: form?.description,
      },
      fields: fields.map((f) => ({
        type: f.type,
        id: f.id,
        name: f.name,
        label: f.label,
        helperText: f.helperText,
        placeholder: f.placeholder,
        required: f.required,
        rows: f.rows,
        options: f.options || [],
      })),
      primaryCtaLabel: primaryCta?.label,
      primaryCtaHref: primaryCta?.href,

      submitLabel: submitLabel ?? "Invia",
      secondaryText,
      formAction,
      formMethod: formMethod ?? "post",
    },
  };
}

function mapQuizCardSection(section: QuizCardSectionSchema): PageSectionConfig {
  const {
    id,
    background,
    backgroundImage,
    layout,
    secondaryText,
    content,
    quiz,
  } = section;

  return {
    type: "quiz-card",
    props: {
      id,
      background: (background as any) ?? "default",
      backgroundImage: backgroundImage && {
        src: backgroundImage.src,
        alt: backgroundImage.alt,
      },
      withOverlay: layout?.withOverlay ?? true,
      overlayClassName: "",
      alignX: layout?.alignX ?? "left",
      alignY: layout?.alignY ?? "center",
      height: layout?.height ?? "md",
      radius: layout?.radius,
      tone: content?.tone,
      eyebrow: content?.eyebrow,
      title: content?.title,
      subtitle: content?.subtitle,
      description: content?.description,
      secondaryText,
      quiz: {
        quizId: quiz.quizId,
        submitLabel: quiz.submitLabel,
        formAction: quiz.formAction,
        progressAction: quiz.progressAction,
        steps: quiz.steps,
        pricing: quiz.pricing,
      },
    },
  };
}

export function mapSectionSchemaToConfig(
  section: SectionSchema,
): PageSectionConfig {
  switch (section.type) {
    case "simple-content":
      return mapSimpleContentSection(section);
    case "text-media":
      return mapTextMediaSection(section);
    case "cover":
      return mapCoverSection(section);
    case "wall-card":
      return mapWallCardSection(section);
    case "form-card":
      return mapFormCardSection(section);
    case "quiz-card":
      return mapQuizCardSection(section);
    default:
      // TS dovrebbe impedirlo, ma per sicurezza:
      throw new Error(`Unsupported section type: ${(section as any).type}`);
  }
}

export function mapPageSchemaToConfigs(page: PageSchema): PageSectionConfig[] {
  return page.sections.map(mapSectionSchemaToConfig);
}
