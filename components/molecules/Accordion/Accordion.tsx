"use client";

import type { ReactNode } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";

export type AccordionDataItem = {
  key: string;
  title: ReactNode;
  subtitle?: ReactNode;
  content: ReactNode;
  isDisabled?: boolean;
};

export type AccordionsProps = {
  items: AccordionDataItem[];
  variant?: "light" | "shadow" | "bordered" | "splitted";
  selectionMode?: "none" | "single" | "multiple";
  defaultExpandedKeys?: string[];
  className?: string;
};

export function Accordions({
  items,
  variant = "splitted",
  selectionMode = "multiple",
  defaultExpandedKeys,
  className = "",
}: AccordionsProps) {
  if (!items?.length) return null;

  return (
    <Accordion
      variant={variant}
      selectionMode={selectionMode}
      defaultExpandedKeys={defaultExpandedKeys}
      className={`w-full ${className}`}
    >
      {/* 
       items-center gap-2 h-9 px-3 rounded-full bg-primary-900 text-[var(--color-primary-300)]  hover:bg-[var(--color-primary-500)]/ hover:text-white transition-colors duration-150
      */}
      {items.map((it) => (
        <AccordionItem
          key={it.key}
          classNames={
            {
              title: 'text-accent-800 text-left text-xl'
            }
          }
          title={it.title}
          className="w-full mx-auto max-w-6xl px-6 bg-neutral-100/30 backdrop-blur-xl rounded-full border-b border-neutral-100 py-0 mt-5 transition-all duration-150"
          subtitle={it.subtitle}
          indicator={({ isOpen }) => (
            <span
              className={`inline-flex items-center justify-center gap-2 !font-[600] tracking-[.5] uppercase transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer rounded-2xl bg-transparent text-[var(--color-accent-800)] border-2 border-[var(--color-accent-800)] text-lg px-3 py-1 ${isOpen ? "rotate-45 rounded-full " : " rounded-full "}`}
              aria-hidden="true"
            >
              +
            </span>
          )}
          isDisabled={it.isDisabled}
        >
          
          <div className="text-center px-10 pb-5">
            {it.content}
          </div>
          
          
        </AccordionItem>
      ))}
    </Accordion>
  );
}
