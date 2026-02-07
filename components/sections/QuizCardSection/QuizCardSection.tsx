"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Title,
  Paragraph,
  Input,
  Checkbox,
  Button,
  Section,
  TitleTone,
  SectionRounded,
  SectionPaddingY,
} from "@/components/atoms";
import { FormField, ContentBlock } from "@/components/molecules";
import { CoverSection } from "../CoverSection";
import type {
  CoverAlignX,
  CoverAlignY,
  CoverHeight,
} from "../CoverSection/CoverSection.style";
import type { CoverBackgroundImage } from "../CoverSection/CoverSection";
import { getFormCardSectionClasses } from "../FormCardSection/FormCardSection.style";

type QuizOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: string;
  score?: number;
  disabled?: boolean;
};

type QuizStep =
  | {
      id: string;
      title: string;
      subtitle?: string;
      type: "radio";
      required?: boolean;
      orientation?: "vertical" | "horizontal";
      options: QuizOption[];
    }
  | {
      id: string;
      title: string;
      subtitle?: string;
      type: "contact";
      required?: boolean;
      fields: any[];
    }
  | {
      id: string;
      title: string;
      subtitle?: string;
      type: "summary";
      required?: boolean;
    };

type Pricing = {
  baseMin: number;
  baseMax: number;
  scoreMultiplierMin: number;
  scoreMultiplierMax: number;
  capMin: number;
  capMax: number;
};

type QuizConfig = {
  quizId: string;
  submitLabel?: ReactNode;
  formAction?: string;
  progressAction?: string;
  steps: QuizStep[] | any;
  pricing: Pricing;
};

export interface QuizCardSectionProps {
  id?: string;
  backgroundImage?: CoverBackgroundImage;
  withOverlay?: boolean;
  overlayClassName?: string;
  background?: any;
  alignX?: CoverAlignX;
  alignY?: CoverAlignY;
  tone?: TitleTone;
  radius?: SectionRounded;
  paddingY?: SectionPaddingY;
  height?: CoverHeight;

  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Testo secondario in footer form (es. “Ti rispondiamo entro 24 h”) */
  secondaryText?: ReactNode;
  quiz: QuizConfig;
}

function pushDL(event: string, payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...payload });
}

function getSessionIdSafe() {
  if (typeof window === "undefined") return "";
  const k = "metis_session_id";
  let v = window.localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    window.localStorage.setItem(k, v);
  }
  return v;
}

function estimateRange(
  steps: QuizStep[],
  answers: Record<string, string>,
  pricing: Pricing
) {
  let score = 0;

  for (const s of steps) {
    if (s.type !== "radio") continue;
    const picked = answers[s.id];
    const opt = (s.options ?? []).find((o) => o.value === picked);
    if (opt?.score) score += opt.score;
  }

  const min = Math.max(
    pricing.capMin,
    Math.round(pricing.baseMin + score * pricing.scoreMultiplierMin)
  );
  const max = Math.min(
    pricing.capMax,
    Math.round(pricing.baseMax + score * pricing.scoreMultiplierMax)
  );

  const round50 = (n: number) => Math.round(n / 50) * 50;

  return { min: round50(min), max: round50(max), score };
}

export const QuizCardSection: FC<QuizCardSectionProps> = ({
  id,
  background,
  backgroundImage,
  withOverlay = true,
  overlayClassName,
  alignX = "left",
  alignY = "center",
  height = "md",
  radius,
  secondaryText,
  tone,
  eyebrow,
  title,
  subtitle,
  description,
  quiz,
}) => {
  const classes = getFormCardSectionClasses();

  const steps: QuizStep[] = useMemo(
    () => (Array.isArray(quiz.steps) ? (quiz.steps as QuizStep[]) : []),
    [quiz.steps]
  );

  const [sessionId, setSessionId] = useState<string>("");

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<Record<string, any>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const startedAt = useRef(Date.now());
  const lastViewAt = useRef(Date.now());

  const autoNextTimeoutRef = useRef<number | null>(null);
  const clearAutoNext = () => {
    if (autoNextTimeoutRef.current) {
      window.clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  };

  const step = steps[stepIndex];

  // init sessionId on client
  useEffect(() => {
    setSessionId(getSessionIdSafe());
  }, []);

  // Auto-scroll se arrivi con ?start=quiz o hash #quiz
  useEffect(() => {
    const url = new URL(window.location.href);
    const start = url.searchParams.get("start");
    if (start === "quiz" || window.location.hash === "#quiz") {
      document
        .getElementById("quiz")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Quiz start
  useEffect(() => {
    if (!sessionId) return;
    pushDL("quiz_start", { quiz_id: quiz.quizId, session_id: sessionId });
  }, [quiz.quizId, sessionId]);

  // Step view + beacon server
  useEffect(() => {
    if (!sessionId) return;

    lastViewAt.current = Date.now();

    pushDL("quiz_step_view", {
      quiz_id: quiz.quizId,
      session_id: sessionId,
      step_index: stepIndex,
      step_id: step?.id,
      step_type: step?.type,
    });

    if (quiz.progressAction && navigator.sendBeacon) {
      navigator.sendBeacon(
        quiz.progressAction,
        JSON.stringify({
          quizId: quiz.quizId,
          sessionId,
          event: "step_view",
          stepIndex,
          stepId: step?.id,
          ts: Date.now(),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, sessionId]);

  // Abandon tracking
  useEffect(() => {
    if (!sessionId) return;

    const onHide = () => {
      const now = Date.now();
      const payload = {
        quizId: quiz.quizId,
        sessionId,
        event: "abandon",
        stepIndex,
        stepId: step?.id,
        timeTotalSec: Math.round((now - startedAt.current) / 1000),
        timeOnStepSec: Math.round((now - lastViewAt.current) / 1000),
        ts: now,
      };

      pushDL("quiz_abandon", payload);

      if (quiz.progressAction && navigator.sendBeacon) {
        navigator.sendBeacon(quiz.progressAction, JSON.stringify(payload));
      }
    };

    window.addEventListener("pagehide", onHide);

    const onVis = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [quiz.quizId, quiz.progressAction, sessionId, stepIndex, step?.id]);

  useEffect(() => {
    return () => clearAutoNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canNext = useMemo(() => {
    if (!step) return false;

    if (step.type === "radio") return !!answers[step.id];

    if (step.type === "summary") return true;

    const required = (step.fields ?? []).filter((f: any) => f.required);
    return required.every(
      (f: any) => !!contact[f.id] && contact[f.id] !== false
    );
  }, [step, answers, contact]);

  const onAnswer = (id: string, value: string) => {
    setAnswers((p) => ({ ...p, [id]: value }));

    if (!sessionId) return;

    pushDL("quiz_answer", {
      quiz_id: quiz.quizId,
      session_id: sessionId,
      step_id: id,
      value,
    });

    if (quiz.progressAction && navigator.sendBeacon) {
      navigator.sendBeacon(
        quiz.progressAction,
        JSON.stringify({
          quizId: quiz.quizId,
          sessionId,
          event: "answer",
          stepId: id,
          value,
          ts: Date.now(),
        })
      );
    }
  };

  const next = () => {
    clearAutoNext();
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const back = () => {
    clearAutoNext();
    setSubmitError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const pickAndGoNext = (stepId: string, value: string) => {
    clearAutoNext();
    onAnswer(stepId, value);

    if (stepIndex < steps.length - 1) {
      autoNextTimeoutRef.current = window.setTimeout(() => {
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
        autoNextTimeoutRef.current = null;
      }, 120);
    }
  };

  const goToSummaryStep = () => {
    const idx = steps.findIndex((s) => s.type === "summary");
    if (idx >= 0) setStepIndex(idx);
    else next();
  };

  async function submit() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const range = estimateRange(steps, answers, quiz.pricing);

    if (sessionId) {
      pushDL("lead_submit", {
        quiz_id: quiz.quizId,
        session_id: sessionId,
        range_min: range.min,
        range_max: range.max,
      });
    }

    const payload = {
      quizId: quiz.quizId,
      sessionId: sessionId || undefined,
      answers,
      contact,
      range,
      ts: Date.now(),
    };

    try {
      const res = await fetch(quiz.formAction ?? "/api/quiz/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("submit_failed");

      if (sessionId) {
        pushDL("lead_success", { quiz_id: quiz.quizId, session_id: sessionId });
      }

      setIsSubmitted(true);
      setIsSubmitting(false);

      // ✅ niente alert: vai allo step finale
      goToSummaryStep();
    } catch {
      if (sessionId) {
        pushDL("lead_error", { quiz_id: quiz.quizId, session_id: sessionId });
      }
      setIsSubmitting(false);
      setSubmitError(
        "Non siamo riusciti a inviare la richiesta. Riprova oppure contattaci su WhatsApp."
      );
    }
  }

  const summary = useMemo(() => {
    const range = estimateRange(steps, answers, quiz.pricing);

    const items = steps
      .filter((s) => s.type === "radio")
      .map((s) => {
        const picked = answers[s.id];
        const opt = (s as any).options?.find((o: any) => o.value === picked);
        return {
          id: s.id,
          title: s.title,
          value: opt?.label ?? picked ?? "",
        };
      })
      .filter((x) => !!x.value);

    return { range, items };
  }, [steps, answers, quiz.pricing]);

  const renderStep = () => {
    if (!step) return null;

    // SUMMARY STEP (ultimo step "bello")
    if (step.type === "summary") {
      return (
        <div className="mb-6 md:mb-8">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
            <Title tone="white" variant="h3">
              Grazie per la tua richiesta di preventivo.
            </Title>

            <Paragraph tone="white" className="mt-2 text-white/80">
              Ecco il tuo riepilogo. Ti contatteremo presto per fissare una call.
            </Paragraph>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <Title tone="white" variant="h4">
                  Stima in fascia
                </Title>
                <Paragraph tone="white" className="mt-2 text-white/80">
                  {`€${summary.range.min} – €${summary.range.max}`}
                </Paragraph>
                <Paragraph tone="white" className="mt-1 text-white/60 text-sm">
                  Questa è una stima basata sulle risposte. Il prezzo finale si
                  definisce dopo una breve analisi del caso.
                </Paragraph>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <Title tone="white" variant="h4">
                  Il tuo riepilogo
                </Title>

                <div className="mt-3 grid gap-3">
                  {summary.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="text-white/70 text-sm">{it.title}</div>
                      <div className="text-white font-medium">{it.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="text-white/70 text-sm">Contatto</div>
                  <div className="text-white font-medium">
                    {contact?.name ? `${contact.name}` : ""}
                    {contact?.company ? ` — ${contact.company}` : ""}
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    {contact?.email ? contact.email : ""}
                    {contact?.phone ? ` • ${contact.phone}` : ""}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <Title tone="white" variant="h4">
                  Prossimo passo
                </Title>
                <Paragraph tone="white" className="mt-2 text-white/80">
                  Ti contattiamo in base al canale che hai scelto. Se preferisci
                  anticipare, puoi scriverci su WhatsApp.
                </Paragraph>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    href="https://wa.me/393494459317"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Scrivici su WhatsApp
                  </Button>

                  <Button variant="primary" type="button" onClick={back}>
                    Modifica risposte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // RADIO STEP
    if (step.type === "radio") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(step.options ?? []).map((o) => {
            const selected = answers[step.id] === o.value;

            return (
              <button
                key={o.value}
                type="button"
                disabled={o.disabled}
                onClick={() => pickAndGoNext(step.id, o.value)}
                aria-pressed={selected}
                className={[
                  "rounded-2xl border-3 p-6 text-left transition",
                  "flex flex-col items-start justify-between min-h-[140px]",
                  selected
                    ? "border-white/70 ring-2 ring-white/20"
                    : "border-white/15 hover:border-white/35",
                  o.disabled ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <div>
                  {o.icon ? (
                    <img
                      src={o.icon}
                      alt=""
                      className="h-10 w-10 mb-3 opacity-90"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="text-base font-semibold text-white">
                    {o.label}
                  </div>

                  {o.description ? (
                    <div className="text-sm text-white/70 mt-1">
                      {o.description}
                    </div>
                  ) : null}
                </div>

                <span
                  className={[
                    "mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-white/10",
                    selected ? "bg-white/15" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // CONTACT STEP
    return (
      <div className="mb-6 md:mb-8">
        {submitError ? (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-white">
            {submitError}
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 items-center gap-x-6 gap-y-4 md:gap-y-6">
          {(step.fields ?? []).map((f: any) => {
            if (f.type === "checkbox") {
              return (
                <FormField key={f.id} className={"md:col-span-2"} id={f.id}>
                  <Checkbox
                    className={classes.checkbox}
                    id={f.id}
                    size="sm"
                    name={f.name}
                    label={f.label}
                    required={f.required}
                    checked={!!contact[f.id]}
                    onChange={(e: any) =>
                      setContact((p) => ({ ...p, [f.id]: e.target.checked }))
                    }
                  />
                </FormField>
              );
            }

            return (
              <FormField
                key={f.id}
                className={classes.formFields}
                id={f.id}
                label={f.label}
                required={f.required}
              >
                <Input
                  variant="glass"
                  type={f.type}
                  name={f.name}
                  className={classes.fields}
                  placeholder={f.placeholder}
                  required={f.required}
                  value={contact[f.id] ?? ""}
                  onChange={(e: any) =>
                    setContact((p) => ({ ...p, [f.id]: e.target.value }))
                  }
                />
              </FormField>
            );
          })}
        </div>
      </div>
    );
  };

  const totalSteps = steps.length;

  return (
    <CoverSection
      id={id}
      background={background}
      backgroundImage={backgroundImage}
      withOverlay={withOverlay}
      overlayClassName={`${overlayClassName ?? ""} pointer-events-none`}
      alignX={alignX}
      alignY={alignY}
      height={height}
      radius={radius}
      contentVariant="card"
    >
      <div className={classes.content}>
        <ContentBlock
          tone={tone || "secondary"}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          body={description}
        />

        <div className="col-span-2">
          <Section
            background={"secondaryGradients"}
            className={`${classes.card} relative z-10`}
            style={{ isolation: "isolate" }}
          >
            <div className={`${classes.header} relative z-20 pointer-events-auto`}>
              <Title tone="white" variant="eyebrow" as="p">
                {`Step ${Math.min(stepIndex + 1, totalSteps)}/${totalSteps}`}
              </Title>

              <Title tone={"white"} variant="h2">
                {step?.title}
              </Title>

              {!!step?.subtitle && (
                <Title tone={"white"} variant="h3">
                  {step.subtitle}
                </Title>
              )}

              <Paragraph tone={"white"} className={classes.description} />
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="_hp"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {renderStep()}

            {/* footer: no buttons on summary (già inclusi nel contenuto) */}
            {step?.type !== "summary" ? (
              <div className={`${classes.footer} relative z-20 pointer-events-auto`}>
                <div className="flex gap-3 relative z-20 pointer-events-auto">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={back}
                    disabled={stepIndex === 0 || isSubmitting}
                  >
                    Indietro
                  </Button>

                  {step?.type === "contact" ? (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={submit}
                      disabled={!canNext || isSubmitting}
                      loading={isSubmitting}
                    >
                      {quiz.submitLabel ?? "Vedi riepilogo"}
                    </Button>
                  ) : (
                    <span />
                  )}
                </div>
              </div>
            ) : null}
          </Section>
        </div>
      </div>
    </CoverSection>
  );
};
