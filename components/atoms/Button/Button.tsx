// components/atoms/Button/Button.tsx
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  ReactNode,
} from "react";
import Link from "next/link";
import {
  getButtonClasses,
  type ButtonVariant,
  type ButtonSize,
} from "./Button.style";

type CommonButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  className?: string;
};

type ButtonAsButtonProps = CommonButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonButtonProps> & {
    href?: undefined;
  };

type ButtonAsLinkProps = CommonButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonButtonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    leftIcon,
    rightIcon,
    loading = false,
    className = "",
    children,
  } = props;

  const classes = getButtonClasses({ variant, size, fullWidth });
  const rootClassName = [classes.root, className].filter(Boolean).join(" ");

  const content = (
    <>
      {leftIcon && (
        <span className="flex items-center justify-center shrink-0">
          {leftIcon}
        </span>
      )}
      <span className="inline-flex items-center">
        {loading && (
          <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
        )}
        {children}
      </span>
      {rightIcon && (
        <span className="flex items-center justify-center shrink-0">
          {rightIcon}
        </span>
      )}
    </>
  );

  // LINK MODE
  if ("href" in props && typeof props.href === "string") {
    // Destructure all custom props to avoid passing them to DOM
    const {
      href,
      target,
      rel,
      onClick,
      variant: _v,
      size: _s,
      fullWidth: _fw,
      leftIcon: _li,
      rightIcon: _ri,
      loading: _l,
      className: _c,
      ...rest
    } = props;

    const isExternal =
      target === "_blank" ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    const safeRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

    // In link-mode we only support "disabled" via loading.
    // (Anchor/Link don't support native disabled)
    const isDisabled = loading;

    const mergedClassName = [
      rootClassName,
      isDisabled ? "pointer-events-none opacity-60" : "",
    ]
      .filter(Boolean)
      .join(" ");

    // External link => <a>
    if (isExternal) {
      return (
        <a
          href={href}
          className={mergedClassName}
          target={target}
          rel={safeRel}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={isDisabled ? (e) => e.preventDefault() : onClick}
          {...rest}
        >
          {content}
        </a>
      );
    }

    // Internal link => <Link> (SEO: href è stampato nel DOM)
    return (
      <Link
        href={href}
        className={mergedClassName}
        target={target as any}
        rel={safeRel as any}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        onClick={isDisabled ? (e) => e.preventDefault() : (onClick as any)}
        {...(rest as any)}
      >
        {content}
      </Link>
    );
  }

  // BUTTON MODE
  // Destructure all custom props to avoid passing them to DOM
  const {
    disabled,
    type,
    onClick,
    variant: _v,
    size: _s,
    fullWidth: _fw,
    leftIcon: _li,
    rightIcon: _ri,
    loading: _l,
    className: _c,
    ...rest
  } = props as ButtonAsButtonProps;
  return (
    <button
      type={type ?? "button"}
      className={rootClassName}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
};
