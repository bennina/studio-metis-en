// components/sections/BriefBuilder/BriefBuilder.tsx
"use client";

import type { FC } from "react";
import { useState, useMemo, useCallback } from "react";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  FileDown,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import {
  Button,
  Input,
  Paragraph,
  Section,
  Textarea,
  Title,
} from "@/components/atoms";
import { FormField } from "@/components/molecules";
import {
  BRIEF_STEPS,
  SERVICES,
  getServicesByCategory,
  formatPrice,
  formatPriceUnit,
  type ServiceItem,
  type ServiceCategory,
} from "@/lib/brief/pricingData";
import {
  type BriefData,
  type SelectedService,
  createEmptyBrief,
  TIMELINE_LABELS,
  BUDGET_LABELS,
  GOAL_LABELS,
  SITE_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
} from "@/lib/brief/briefTypes";
import { getBriefBuilderClasses } from "./BriefBuilder.style";
import { useTranslation, type Locale } from "@/lib/i18n";

export interface BriefBuilderProps {
  onGenerate?: (data: BriefData) => void;
  initialData?: Partial<BriefData>;
  locale?: Locale;
}

export const BriefBuilder: FC<BriefBuilderProps> = ({
  onGenerate,
  initialData,
  locale = "it",
}) => {
  const classes = getBriefBuilderClasses();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [briefData, setBriefData] = useState<BriefData>(() => ({
    ...createEmptyBrief(),
    ...initialData,
  }));
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcola i totali
  const totals = useMemo(() => {
    let total = 0;
    let recurring = 0;

    // Aggiungi il tipo di sito selezionato
    if (briefData.selectedSiteType) {
      const siteService = SERVICES.find(
        (s) => s.id === briefData.selectedSiteType,
      );
      if (siteService) {
        total += siteService.price;
      }
    }

    // Aggiungi i servizi selezionati
    briefData.selectedServices.forEach((selected) => {
      const service = SERVICES.find((s) => s.id === selected.serviceId);
      if (service) {
        const quantity = selected.quantity || 1;
        const price = (selected.customPrice ?? service.price) * quantity;

        if (["mensile", "annuale", "trimestrale"].includes(service.priceUnit)) {
          recurring += price;
        } else {
          total += price;
        }
      }
    });

    return { total, recurring };
  }, [briefData.selectedSiteType, briefData.selectedServices]);

  // Update brief data
  const updateBrief = useCallback(
    <K extends keyof BriefData>(key: K, value: BriefData[K]) => {
      setBriefData((prev) => ({
        ...prev,
        [key]: value,
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const updateClientInfo = useCallback((field: string, value: string) => {
    setBriefData((prev) => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateSituation = useCallback((field: string, value: unknown) => {
    setBriefData((prev) => ({
      ...prev,
      currentSituation: { ...prev.currentSituation, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateObjectives = useCallback((field: string, value: unknown) => {
    setBriefData((prev) => ({
      ...prev,
      objectives: { ...prev.objectives, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Toggle service selection
  const toggleService = useCallback(
    (serviceId: string, isTypeSelection = false) => {
      if (isTypeSelection) {
        setBriefData((prev) => ({
          ...prev,
          selectedSiteType:
            prev.selectedSiteType === serviceId ? undefined : serviceId,
          updatedAt: new Date().toISOString(),
        }));
      } else {
        setBriefData((prev) => {
          const existing = prev.selectedServices.find(
            (s) => s.serviceId === serviceId,
          );
          if (existing) {
            return {
              ...prev,
              selectedServices: prev.selectedServices.filter(
                (s) => s.serviceId !== serviceId,
              ),
              updatedAt: new Date().toISOString(),
            };
          } else {
            return {
              ...prev,
              selectedServices: [
                ...prev.selectedServices,
                { serviceId, quantity: 1 },
              ],
              updatedAt: new Date().toISOString(),
            };
          }
        });
      }
    },
    [],
  );

  // Update service quantity
  const updateServiceQuantity = useCallback(
    (serviceId: string, delta: number) => {
      setBriefData((prev) => {
        const services = prev.selectedServices.map((s) => {
          if (s.serviceId === serviceId) {
            return { ...s, quantity: Math.max(1, (s.quantity || 1) + delta) };
          }
          return s;
        });
        return {
          ...prev,
          selectedServices: services,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [],
  );

  // Toggle service details
  const toggleExpanded = useCallback((serviceId: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  }, []);

  // Check if service is selected
  const isServiceSelected = useCallback(
    (serviceId: string) => {
      return briefData.selectedServices.some((s) => s.serviceId === serviceId);
    },
    [briefData.selectedServices],
  );

  // Get selected quantity
  const getServiceQuantity = useCallback(
    (serviceId: string) => {
      return (
        briefData.selectedServices.find((s) => s.serviceId === serviceId)
          ?.quantity || 1
      );
    },
    [briefData.selectedServices],
  );

  // Generate PDF
  const handleGenerate = async () => {
    setIsGenerating(true);
    const finalData: BriefData = {
      ...briefData,
      total: totals.total,
      recurring: totals.recurring,
    };

    if (onGenerate) {
      onGenerate(finalData);
    } else {
      // Default: call API to generate PDF
      try {
        const response = await fetch("/api/brief/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `preventivo-${briefData.clientInfo.companyName || "draft"}-${new Date().toISOString().split("T")[0]}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
    setIsGenerating(false);
  };

  // Render service card
  const renderServiceCard = (service: ServiceItem, isTypeSelection = false) => {
    const isSelected = isTypeSelection
      ? briefData.selectedSiteType === service.id
      : isServiceSelected(service.id);
    const isExpanded = expandedServices.has(service.id);
    const quantity = getServiceQuantity(service.id);
    const showQuantity =
      !isTypeSelection &&
      isSelected &&
      ["a_pagina", "a_ora"].includes(service.priceUnit);

    return (
      <div
        key={service.id}
        className={
          isSelected ? classes.serviceCardSelected : classes.serviceCard
        }
      >
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={() => toggleService(service.id, isTypeSelection)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-sm">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? classes.optionsSelected
                    : classes.options
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <span className={classes.serviceName}>{service.name}</span>
            </div>
            <p className={classes.serviceDescription}>{service.description}</p>
            <p className={classes.servicePrice}>
              {formatPrice(service.price)} {formatPriceUnit(service.priceUnit)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(service.id);
            }}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Mostra dettagli"
          >
            <Info size={18} />
          </button>
        </div>

        {isExpanded && (
          <div className={classes.serviceExpand}>
            <p className={classes.serviceWhy}>
              <strong>Perché serve:</strong> {service.whyNeeded}
            </p>
            <p className="text-md text-neutral-100 mb-xs">Vantaggi:</p>
            <ul className={classes.serviceBenefits}>
              {service.benefits.map((benefit, i) => (
                <li key={i} className={classes.serviceBenefit}>
                  <Check size={14} className={classes.serviceBenefitIcon} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showQuantity && (
          <div className={classes.quantityWrapper}>
            <span className="text-sm text-primary-800">Quantità:</span>
            <button
              type="button"
              className={classes.quantityButton}
              onClick={(e) => {
                e.stopPropagation();
                updateServiceQuantity(service.id, -1);
              }}
            >
              <Minus size={14} />
            </button>
            <span className={classes.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={classes.quantityButton}
              onClick={(e) => {
                e.stopPropagation();
                updateServiceQuantity(service.id, 1);
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render option card (radio-like)
  const renderOptionCard = <T extends string>(
    value: T,
    currentValue: T,
    label: string,
    description?: string,
    onChange?: (value: T) => void,
  ) => (
    <div
      key={value}
      className={
        value === currentValue ? classes.optionCardSelected : classes.optionCard
      }
      onClick={() => onChange?.(value)}
    >
      <div className="flex items-center gap-sm">
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            value === currentValue ? "border-primary-500" : classes.options
          }`}
        >
          {value === currentValue && (
            <div className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </div>
        <span className={value === currentValue ? classes.optionTitle : classes.optionTitledSelected}>{label}</span>
      </div>
      {description && (
        <p className={classes.optionDescription}>{description}</p>
      )}
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    const step = BRIEF_STEPS[currentStep];

    switch (step.id) {
      case "info_cliente":
        return (
          <div className={classes.formGrid}>
            <FormField id="projectName" label="Nome Progetto" required>
              <Input
                variant="glass"
                name="projectName"
                value={briefData.clientInfo.projectName}
                onChange={(e) =>
                  updateClientInfo("projectName", e.target.value)
                }
                placeholder="es. Nuovo sito aziendale"
              />
            </FormField>
            <FormField id="companyName" label="Azienda / Cliente" required>
              <Input
                variant="glass"
                name="companyName"
                value={briefData.clientInfo.companyName}
                onChange={(e) =>
                  updateClientInfo("companyName", e.target.value)
                }
                placeholder="Nome azienda"
              />
            </FormField>
            <FormField id="sector" label="Settore">
              <Input
                variant="glass"
                name="sector"
                value={briefData.clientInfo.sector}
                onChange={(e) => updateClientInfo("sector", e.target.value)}
                placeholder="es. Edilizia, Consulenza, Retail..."
              />
            </FormField>
            <FormField id="contactName" label="Referente">
              <Input
                variant="glass"
                name="contactName"
                value={briefData.clientInfo.contactName}
                onChange={(e) =>
                  updateClientInfo("contactName", e.target.value)
                }
                placeholder="Nome e cognome"
              />
            </FormField>
            <FormField id="contactEmail" label="Email">
              <Input
                variant="glass"
                type="email"
                name="contactEmail"
                value={briefData.clientInfo.contactEmail}
                onChange={(e) =>
                  updateClientInfo("contactEmail", e.target.value)
                }
                placeholder="email@azienda.it"
              />
            </FormField>
            <FormField id="contactPhone" label="Telefono">
              <Input
                variant="glass"
                type="tel"
                name="contactPhone"
                value={briefData.clientInfo.contactPhone}
                onChange={(e) =>
                  updateClientInfo("contactPhone", e.target.value)
                }
                placeholder="+39 ..."
              />
            </FormField>
          </div>
        );

      case "situazione":
        return (
          <div className="space-y-lg">
            <div>
              <p className={classes.formLabel + " mb-md"}>
                Situazione sito attuale
              </p>
              <div className={classes.optionGrid}>
                {Object.entries(SITE_STATUS_LABELS).map(([value, label]) =>
                  renderOptionCard(
                    value as "no" | "rebuild" | "improve",
                    briefData.currentSituation.hasSite,
                    label,
                    undefined,
                    (v) => updateSituation("hasSite", v),
                  ),
                )}
              </div>
            </div>

            {briefData.currentSituation.hasSite !== "no" && (
              <FormField id="currentSiteUrl" label="URL sito attuale">
                <Input
                  variant="glass"
                  name="currentSiteUrl"
                  value={briefData.currentSituation.currentSiteUrl || ""}
                  onChange={(e) =>
                    updateSituation("currentSiteUrl", e.target.value)
                  }
                  placeholder="https://..."
                />
              </FormField>
            )}

            <div className={classes.formGrid}>
              <div
                className={
                  briefData.currentSituation.hasDomain
                    ? classes.optionCardSelected
                    : classes.optionCard
                }
                onClick={() =>
                  updateSituation(
                    "hasDomain",
                    !briefData.currentSituation.hasDomain,
                  )
                }
              >
                <div className="flex items-center gap-sm">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      briefData.currentSituation.hasDomain
                        ? classes.optionsSelected
                        : classes.options
                    }`}
                  >
                    {briefData.currentSituation.hasDomain && (
                      <Check size={14} className="text-white" />
                    )}

                    
                  </div>
                  <span className={briefData.currentSituation.hasDomain ? classes.optionTitle : classes.optionTitledSelected}>Ha già un dominio</span>
                </div>
              </div>

              <div
                className={
                  briefData.currentSituation.hasHosting
                    ? classes.optionCardSelected
                    : classes.optionCard
                }
                onClick={() =>
                  updateSituation(
                    "hasHosting",
                    !briefData.currentSituation.hasHosting,
                  )
                }
              >
                <div className="flex items-center gap-sm">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      briefData.currentSituation.hasHosting
                        ? classes.optionsSelected
                        : classes.options
                    }`}
                  >
                    {briefData.currentSituation.hasHosting && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  <span className={briefData.currentSituation.hasHosting ? classes.optionTitle : classes.optionTitledSelected}>Ha già un hosting</span>
                </div>
              </div>

              <div
                className={
                  briefData.currentSituation.hasEmail
                    ? classes.optionCardSelected
                    : classes.optionCard
                }
                onClick={() =>
                  updateSituation(
                    "hasEmail",
                    !briefData.currentSituation.hasEmail,
                  )
                }
              >
                <div className="flex items-center gap-sm">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      briefData.currentSituation.hasEmail
                        ? classes.optionsSelected
                        : classes.options
                    }`}
                  >
                    {briefData.currentSituation.hasEmail && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  <span className={briefData.currentSituation.hasEmail ? classes.optionTitle : classes.optionTitledSelected}>
                    Ha email professionale
                  </span>
                </div>
              </div>

              <div
                className={
                  briefData.currentSituation.hasBrandIdentity
                    ? classes.optionCardSelected
                    : classes.optionCard
                }
                onClick={() =>
                  updateSituation(
                    "hasBrandIdentity",
                    !briefData.currentSituation.hasBrandIdentity,
                  )
                }
              >
                <div className="flex items-center gap-sm">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      briefData.currentSituation.hasBrandIdentity
                        ? classes.optionsSelected
                        : classes.options
                    }`}
                  >
                    {briefData.currentSituation.hasBrandIdentity && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  <span className={briefData.currentSituation.hasBrandIdentity ? classes.optionTitle : classes.optionTitledSelected}>
                    Ha brand identity definita
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className={classes.formLabel + " mb-md"}>
                Stato dei contenuti (testi, foto)
              </p>
              <div className={classes.optionGrid}>
                {Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) =>
                  renderOptionCard(
                    value as "none" | "partial" | "complete",
                    briefData.currentSituation.hasContent,
                    label,
                    undefined,
                    (v) => updateSituation("hasContent", v),
                  ),
                )}
              </div>
            </div>

            <FormField
              id="situationNotes"
              label="Note sulla situazione attuale"
            >
              <Textarea
                className={classes.fields}
                name="situationNotes"
                value={briefData.currentSituation.notes || ""}
                onChange={(e) => updateSituation("notes", e.target.value)}
                placeholder="Informazioni aggiuntive..."
                rows={3}
              />
            </FormField>
          </div>
        );

      case "obiettivi":
        return (
          <div className="space-y-lg">
            <div>
              <p className={classes.formLabel + " mb-md"}>
                Obiettivo principale
              </p>
              <div className={classes.optionGrid}>
                {Object.entries(GOAL_LABELS).map(([value, label]) =>
                  renderOptionCard(
                    value as
                      | "leads"
                      | "sales"
                      | "presence"
                      | "events"
                      | "other",
                    briefData.objectives.mainGoal,
                    label,
                    undefined,
                    (v) => updateObjectives("mainGoal", v),
                  ),
                )}
              </div>
            </div>

            <FormField id="goalDescription" label="Descrizione obiettivo">
              <Textarea
                className={classes.fields}
                name="goalDescription"
                value={briefData.objectives.goalDescription || ""}
                onChange={(e) =>
                  updateObjectives("goalDescription", e.target.value)
                }
                placeholder="Descrivi meglio cosa vuole ottenere il cliente..."
                rows={2}
              />
            </FormField>

            <FormField
              id="targetAudience"
              label="Target / Pubblico di riferimento"
            >
              <Textarea
                className={classes.fields}
                name="targetAudience"
                value={briefData.objectives.targetAudience}
                onChange={(e) =>
                  updateObjectives("targetAudience", e.target.value)
                }
                placeholder="Chi sono i clienti ideali? Età, professione, esigenze..."
                rows={2}
              />
            </FormField>

            <FormField id="competitors" label="Competitor / Riferimenti">
              <Textarea
                className={classes.fields}
                name="competitors"
                value={briefData.objectives.competitors || ""}
                onChange={(e) =>
                  updateObjectives("competitors", e.target.value)
                }
                placeholder="Siti di competitor o esempi di riferimento..."
                rows={2}
              />
            </FormField>

            <div>
              <p className={classes.formLabel + " mb-md"}>Timeline</p>
              <div className={classes.optionGrid}>
                {Object.entries(TIMELINE_LABELS).map(([value, label]) =>
                  renderOptionCard(
                    value as
                      | "urgent"
                      | "1month"
                      | "2months"
                      | "3months"
                      | "flexible",
                    briefData.objectives.timeline,
                    label,
                    undefined,
                    (v) => updateObjectives("timeline", v),
                  ),
                )}
              </div>
            </div>

            <div>
              <p className={classes.formLabel + " mb-md"}>Budget indicativo</p>
              <div className={classes.optionGrid}>
                {Object.entries(BUDGET_LABELS).map(([value, label]) =>
                  renderOptionCard(
                    value as
                      | "under2k"
                      | "2k-5k"
                      | "5k-10k"
                      | "10k-20k"
                      | "over20k",
                    briefData.objectives.budgetRange,
                    label,
                    undefined,
                    (v) => updateObjectives("budgetRange", v),
                  ),
                )}
              </div>
            </div>
          </div>
        );

      case "tipologia_sito":
        return (
          <div>
            <Paragraph className="mb-lg" tone="white">
              Seleziona il tipo di sito più adatto alle esigenze del cliente.
              Clicca sull&apos;icona info per vedere i dettagli.
            </Paragraph>
            <div className={classes.serviceGrid}>
              {getServicesByCategory("tipologia_sito").map((service) =>
                renderServiceCard(service, true),
              )}
            </div>
          </div>
        );

      case "infrastruttura":
      case "contenuti":
      case "brand":
      case "funzionalita":
      case "tracking":
      case "post_lancio":
        const categoryServices = getServicesByCategory(
          step.category as ServiceCategory,
        );
        return (
          <div>
            <p className="text-sm text-primary-800 mb-lg">
              Seleziona i servizi necessari. Ogni servizio include una
              spiegazione del perché è utile e i vantaggi che porta.
            </p>
            <div className={classes.serviceGrid}>
              {categoryServices.map((service) => renderServiceCard(service))}
            </div>
          </div>
        );

      case "riepilogo":
        return (
          <div className="space-y-lg">
            {/* Client info summary */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-md">
                Informazioni Cliente
              </h3>
              <div className="grid grid-cols-2 gap-sm text-sm">
                <div className="text-primary-800">Progetto:</div>
                <div className="text-white">
                  {briefData.clientInfo.projectName || "-"}
                </div>
                <div className="text-primary-800">Azienda:</div>
                <div className="text-white">
                  {briefData.clientInfo.companyName || "-"}
                </div>
                <div className="text-primary-800">Settore:</div>
                <div className="text-white">
                  {briefData.clientInfo.sector || "-"}
                </div>
              </div>
            </div>

            {/* Objectives summary */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-md">
                Obiettivi
              </h3>
              <div className="grid grid-cols-2 gap-sm text-sm">
                <div className="text-primary-800">Obiettivo:</div>
                <div className="text-white">
                  {GOAL_LABELS[briefData.objectives.mainGoal]}
                </div>
                <div className="text-primary-800">Timeline:</div>
                <div className="text-white">
                  {TIMELINE_LABELS[briefData.objectives.timeline]}
                </div>
                <div className="text-primary-800">Budget:</div>
                <div className="text-white">
                  {BUDGET_LABELS[briefData.objectives.budgetRange]}
                </div>
              </div>
            </div>

            {/* Internal notes */}
            <FormField
              id="internalNotes"
              label="Note interne (non incluse nel PDF)"
            >
              <Textarea
                className={classes.fields}
                name="internalNotes"
                value={briefData.internalNotes || ""}
                onChange={(e) => updateBrief("internalNotes", e.target.value)}
                placeholder="Note per uso interno..."
                rows={3}
              />
            </FormField>

            <FormField
              id="clientNotes"
              label="Note per il cliente (incluse nel PDF)"
            >
              <Textarea
                className={classes.fields}
                name="clientNotes"
                value={briefData.clientNotes || ""}
                onChange={(e) => updateBrief("clientNotes", e.target.value)}
                placeholder="Note aggiuntive da includere nel preventivo..."
                rows={3}
              />
            </FormField>

            <div className={classes.formGrid}>
              <FormField id="discountPercent" label="Sconto (%)">
                <Input
                  variant="glass"
                  type="number"
                  name="discountPercent"
                  value={briefData.discountPercent || ""}
                  onChange={(e) =>
                    updateBrief(
                      "discountPercent",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  placeholder="0"
                  min={0}
                  max={50}
                />
              </FormField>
              <FormField id="discountReason" label="Motivazione sconto">
                <Input
                  variant="glass"
                  name="discountReason"
                  value={briefData.discountReason || ""}
                  onChange={(e) =>
                    updateBrief("discountReason", e.target.value)
                  }
                  placeholder="es. Cliente storico, bundle..."
                />
              </FormField>
            </div>

            <div className={classes.formGrid}>
              <FormField id="validityDays" label="Validità preventivo (giorni)">
                <Input
                  variant="glass"
                  type="number"
                  name="validityDays"
                  value={briefData.validityDays}
                  onChange={(e) =>
                    updateBrief("validityDays", Number(e.target.value) || 30)
                  }
                  min={7}
                  max={90}
                />
              </FormField>
              <FormField id="paymentTerms" label="Condizioni di pagamento">
                <Input
                  variant="glass"
                  name="paymentTerms"
                  value={briefData.paymentTerms || ""}
                  onChange={(e) => updateBrief("paymentTerms", e.target.value)}
                  placeholder="es. 50% anticipo, 50% a consegna"
                />
              </FormField>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render summary panel
  const renderSummary = () => {
    const selectedSiteService = briefData.selectedSiteType
      ? SERVICES.find((s) => s.id === briefData.selectedSiteType)
      : null;

    const selectedServicesByCategory = briefData.selectedServices.reduce(
      (acc, selected) => {
        const service = SERVICES.find((s) => s.id === selected.serviceId);
        if (service) {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push({ service, selected });
        }
        return acc;
      },
      {} as Record<
        string,
        Array<{ service: ServiceItem; selected: SelectedService }>
      >,
    );

    const categoryLabels: Record<ServiceCategory, string> = {
      tipologia_sito: "Sito",
      infrastruttura: "Infrastruttura",
      contenuti: "Contenuti",
      brand: "Brand",
      funzionalita: "Funzionalità",
      tracking: "Tracking",
      post_lancio: "Post-Lancio",
    };

    const discount = briefData.discountPercent || 0;
    const discountedTotal = totals.total * (1 - discount / 100);

    return (
      <div className={classes.summary}>
        <h3 className={classes.summaryTitle}>Riepilogo Preventivo</h3>

        {/* Site type */}
        {selectedSiteService && (
          <div className={classes.summarySection}>
            <p className={classes.summarySectionTitle}>Tipologia Sito</p>
            <div className={classes.summaryItem}>
              <span className={classes.summaryItemName}>
                {selectedSiteService.name}
              </span>
              <span className={classes.summaryItemPrice}>
                {formatPrice(selectedSiteService.price)}
              </span>
            </div>
          </div>
        )}

        {/* Services by category */}
        {Object.entries(selectedServicesByCategory).map(([category, items]) => (
          <div key={category} className={classes.summarySection}>
            <p className={classes.summarySectionTitle}>
              {categoryLabels[category as ServiceCategory]}
            </p>
            {items.map(({ service, selected }) => {
              const qty = selected.quantity || 1;
              const price = service.price * qty;
              const isRecurring = [
                "mensile",
                "annuale",
                "trimestrale",
              ].includes(service.priceUnit);

              return (
                <div key={service.id} className={classes.summaryItem}>
                  <span className={classes.summaryItemName}>
                    {service.name}
                    {qty > 1 && ` (x${qty})`}
                    {isRecurring && " *"}
                  </span>
                  <span className={classes.summaryItemPrice}>
                    {formatPrice(price)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        <div className={classes.summaryDivider} />

        {/* Subtotal */}
        <div className={classes.summaryItem}>
          <span className={classes.summaryItemName}>Subtotale una tantum</span>
          <span className={classes.summaryItemPrice}>
            {formatPrice(totals.total)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className={classes.summaryItem}>
            <span className="text-accent-400">Sconto {discount}%</span>
            <span className="text-accent-400">
              -{formatPrice((totals.total * discount) / 100)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className={classes.summaryTotal}>
          <span className={classes.summaryTotalLabel}>{t("ui.total")}</span>
          <span className={classes.summaryTotalPrice}>
            {formatPrice(discountedTotal)}
          </span>
        </div>

        {/* Recurring */}
        {totals.recurring > 0 && (
          <p className={classes.summaryRecurring}>
            {t("ui.recurring")}: {formatPrice(totals.recurring)}
          </p>
        )}

        <p className={classes.summaryNote}>
          Validità preventivo: {briefData.validityDays} giorni.
        </p>
      </div>
    );
  };

  const currentStepData = BRIEF_STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / BRIEF_STEPS.length) * 100;

  return (
    <Section
      background="primaryGradients"
      className="min-h-screen flex items-center justify-center"
    >
      <div className={classes.container}>
        {/* Header */}
        <div className={classes.header}>
          <Title
            as="h1"
            variant="h1"
            tone="white"
            className={classes.headerTitle}
          >
            Brief Builder
          </Title>
          <Title
            as="h2"
            variant="subtitle"
            tone="white"
            className={classes.headerSubtitle}
          >
            Configura il preventivo per il cliente
          </Title>
        </div>

        {/* Progress */}
        <div className={classes.progress}>
          <div className={classes.progressBar}>
            <div
              className={classes.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={classes.progressSteps}>
            {BRIEF_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={
                  index === currentStep
                    ? classes.progressStepActive
                    : index < currentStep
                      ? classes.progressStepCompleted
                      : classes.progressStep
                }
              >
                <span className="font-bold mr-xs">{index + 1}.</span>
                {t(`steps.${step.id}`) || step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={classes.content}>
          {/* Main panel */}
          <div className={classes.mainPanel}>
            <div className={classes.stepCard}>
              <div>
                <h2 className={classes.stepTitle}>{currentStepData.title}</h2>
                <p className={classes.stepDescription}>
                  {currentStepData.description}
                </p>
              </div>
              <div>{renderStepContent()}</div>
            </div>

            {/* Navigation */}
            <div className={classes.navigation}>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                leftIcon={<ChevronLeft size={18} />}
              >
                {t("ui.back")}
              </Button>

              {currentStep < BRIEF_STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  rightIcon={<ChevronRight size={18} />}
                >
                  {t("ui.next")}
                </Button>
              ) : (
                <Button
                  variant="accent"
                  onClick={handleGenerate}
                  loading={isGenerating}
                  leftIcon={<FileDown size={18} />}
                >
                  {t("ui.generate")}
                </Button>
              )}
            </div>
          </div>

          {/* Side panel - Summary */}
          <div className={classes.sidePanel}>{renderSummary()}</div>
        </div>
      </div>
    </Section>
  );
};
