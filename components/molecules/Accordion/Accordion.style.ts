export type AccordionMode = "single" | "multiple";

export function getAccordionClasses() {
  return {
    root: ["flex", "flex-col", "gap-4"].join(" "),
    item: [
      "rounded-2xl",
      "border",
      "border-white/10",
      "bg-[var(--color-neutral-300)]/15",
      "backdrop-blur-sm",
      "overflow-hidden",
    ].join(" "),
    trigger: [
      "w-full",
      "flex",
      "items-start",
      "gap-4",
      "p-5",
      "text-left",
      "transition",
      "hover:bg-white/5",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-white/20",
    ].join(" "),
    chevron: [
      "shrink-0",
      "mt-1",
      "transition-transform",
      "duration-200",
      "opacity-80",
    ].join(" "),
    // animazione “grid rows trick” (niente max-height hack)
    panelOuter: ["grid", "transition-[grid-template-rows]", "duration-300"].join(" "),
    panelOpen: "grid-rows-[1fr]",
    panelClosed: "grid-rows-[0fr]",
    panelInner: ["min-h-0", "overflow-hidden", "px-5", "pb-5"].join(" "),
  };
}
