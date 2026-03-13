import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import clsx from "clsx";

type FormActionButtonVariant = "primary" | "secondary";

type FormActionButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: FormActionButtonVariant;
  }
>;

const baseButtonClass =
  "inline-flex items-center justify-center rounded-full border-2 p-4 text-center text-sm font-medium leading-none transition-colors duration-200 focus-visible:border-brand-primary focus-visible:shadow-[0_0_0_3px_rgba(0,84,253,0.2)] focus-visible:outline-none";

const buttonVariantClasses: Record<FormActionButtonVariant, string> = {
  primary: "border-brand-primary bg-brand-primary text-white",
  secondary: "border-border-subtle bg-white text-brand-primary",
};

const disabledButtonClass = "cursor-not-allowed opacity-50";

export function FormActionButton({
  variant,
  className,
  children,
  disabled,
  type = "button",
  ...buttonProps
}: FormActionButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        baseButtonClass,
        buttonVariantClasses[variant],
        disabled && disabledButtonClass,
        className,
      )}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
