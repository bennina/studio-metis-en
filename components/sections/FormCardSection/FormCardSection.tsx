"use client";
// components/sections/FormCardSection/FormCardSection.tsx
import type { FC, ReactNode } from "react";
import {
  Title,
  Paragraph,
  Input,
  Textarea,
  Checkbox,
  Button,
  SectionRounded,
  SectionPaddingY,
  TitleTone,
  Section,
} from "@/components/atoms";
import { FormField, RadioGroup, ContentBlock } from "@/components/molecules";
import { CoverSection } from "../CoverSection";
import type {
  CoverAlignX,
  CoverAlignY,
  CoverHeight,
} from "../CoverSection/CoverSection.style";
import type { CoverBackgroundImage } from "../CoverSection/CoverSection";
import { getFormCardSectionClasses } from "./FormCardSection.style";

export type FormCardFieldType =
  | "text"
  | "email"
  | "textarea"
  | "checkbox"
  | "radio";

interface BaseFormCardField {
  id: string;
  name: string;
  label: ReactNode;
  helperText?: ReactNode;
  required?: boolean;
}

export interface FormCardTextField extends BaseFormCardField {
  type: "text" | "email" | "tel";
  placeholder?: string;
}

export interface FormCardTextareaField extends BaseFormCardField {
  type: "textarea";
  placeholder?: string;
  rows?: number;
}

export interface FormCardCheckboxField extends BaseFormCardField {
  type: "checkbox";
}

export interface FormCardRadioField extends BaseFormCardField {
  type: "radio";
  options: {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
  }[];
  orientation?: "vertical" | "horizontal";
}

export type FormCardFieldConfig =
  | FormCardTextField
  | FormCardTextareaField
  | FormCardCheckboxField
  | FormCardRadioField;

export interface FormCardSectionProps {
  /** Immagine di sfondo (stessa logica della CoverSection) */
  backgroundImage?: CoverBackgroundImage;
  withOverlay?: boolean;
  overlayClassName?: string;
  background?: any;
  /** Posizionamento del blocco form */
  alignX?: CoverAlignX;
  alignY?: CoverAlignY;
  tone?: TitleTone;
  radius?: SectionRounded;
  /** padding verticale della section (default: "xl") */
  paddingY?: SectionPaddingY;
  height?: CoverHeight;

  /** Contenuto testuale del form */
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  primaryCtaLabel?: ReactNode;
  primaryCtaHref?: string;
  form: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };

  /** Campi del form, dinamici */
  fields: FormCardFieldConfig[];

  /** Testo bottone submit */
  submitLabel?: ReactNode;

  /** Testo secondario in footer form (es. “Ti rispondiamo entro 24 h”) */
  secondaryText?: ReactNode;

  /** Props HTML base del form (action, method, ecc.) opzionali */
  formAction?: string;
  formMethod?: "get" | "post";

  className?: string;
  id?: string;
}

/**
 * FormCardSection
 *
 * Cover con:
 * - immagine di sfondo
 * - blocco card posizionabile (left/center/right + top/center/bottom)
 * - form dinamico con:
 *   - text/email
 *   - textarea
 *   - checkbox (es. privacy obbligatoria + newsletter facoltativa)
 */
export const FormCardSection: FC<FormCardSectionProps> = ({
  backgroundImage,
  background,
  withOverlay = true,
  overlayClassName,
  paddingY,
  alignX = "right",
  alignY = "center",
  height = "md",
  eyebrow,
  title,
  primaryCtaHref,
  description,
  primaryCtaLabel,
  fields,
  tone,
  submitLabel = "Invia",
  secondaryText,
  formAction,
  form,
  radius,
  formMethod = "post",
  className = "",
  id,
  subtitle,
  ...contentProps
}) => {
  const classes = getFormCardSectionClasses();

  const renderField = (field: FormCardFieldConfig) => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email": {
        return (
          <FormField
            key={field.id}
            className={classes.formFields}
            id={field.id}
            label={field.label}
            required={field.required}
            helperText={field.helperText}
          >
            <Input
              variant="glass"
              type={field.type}
              name={field.name}
              className={classes.fields}
              placeholder={field.placeholder}
              required={field.required}
            />
          </FormField>
        );
      }

      case "textarea": {
        return (
          <FormField
            key={field.id}
            className={"md:col-span-2 mb-6"}
            id={field.id}
            label={field.label}
            required={field.required}
            helperText={field.helperText}
          >
            <Textarea
              name={field.name}
              className={classes.fields}
              placeholder={field.placeholder}
              rows={field.rows ?? 4}
              required={field.required}
            />
          </FormField>
        );
      }

      case "radio": {
        return (
          field.options && (
            <FormField
              key={field.name}
              className={"md:col-span-2 mb-6"}
              id={field.name}
              label={field.label}
              required={field.required}
              helperText={field.helperText}
            >
              <RadioGroup
                key={field.name}
                name={field.name}
                options={field.options}
                orientation={field.orientation ?? "horizontal"}
              />
            </FormField>
          )
        );
      }

      case "checkbox": {
        // qui la label è accanto alla checkbox
        return (
          <FormField
            key={field.id}
            className={"md:col-span-2"}
            id={field.id}
            helperText={field.helperText}
          >
            <Checkbox
              className={classes.checkbox}
              id={field.id}
              size="sm"
              name={field.name}
              label={field.label}
              required={field.required}
            />
          </FormField>
        );
      }

      default:
        return null;
    }
  };

  return (
    <CoverSection
      id={id}
      background={background}
      backgroundImage={backgroundImage}
      withOverlay={withOverlay}
      overlayClassName={overlayClassName}
      alignX={alignX}
      alignY={alignY}
      height={height}
      radius={radius}
      paddingY={paddingY}
      contentVariant="card"
      className={className}
    >
      <div className={classes.content}>
        <ContentBlock
          tone={tone || 'secondary'}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          body={description}
          primaryCtaLabel={primaryCtaLabel}
          primaryCtaHref={primaryCtaHref}
        />

        <form className={classes.form} action={formAction} method={formMethod}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <Section background={'secondary'} className={classes.card}>
            {(form?.eyebrow || form?.title || form?.description) && (
              <div className={classes.header}>
                {form?.eyebrow && (
                  <Title tone="white" variant="eyebrow" as="p">
                    {form?.eyebrow}
                  </Title>
                )}
                {form?.title && (
                  <Title tone={"white"} variant="h2">
                    {form?.title}
                  </Title>
                )}
                {form?.description && (
                  <Paragraph tone={"white"} className={classes.description}>
                    {form?.description}
                  </Paragraph>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 items-center gap-x-6 gap-y-4 md:gap-y-6 mb-6 md:mb-8">
              {fields.map(renderField)}
            </div>
            <div className={classes.footer}>
              <Button variant="primary" type="submit">
                {submitLabel}
              </Button>

              {secondaryText && (
                <Paragraph tone={'white'} className={classes.secondaryText}>
                  {secondaryText}
                </Paragraph>
              )}
            </div>
          </Section>
        </form>
      </div>
    </CoverSection>
  );
};
