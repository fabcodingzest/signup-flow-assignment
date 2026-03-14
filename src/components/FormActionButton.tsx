import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import clsx from "clsx";

type FormActionButtonVariant = "primary" | "secondary";

type FormActionButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
    loadingText?: string;
    variant: FormActionButtonVariant;
  }
>;

const baseButtonClass =
  "inline-flex w-full max-w-[170px] items-center justify-center rounded-full border-2 px-3 py-3 text-center text-sm font-medium leading-none transition-colors duration-200 sm:max-w-[190px] sm:px-4 sm:py-4 md:max-w-[210px] lg:max-w-[250px] focus-visible:border-brand-primary focus-visible:shadow-[0_0_0_3px_rgba(0,84,253,0.2)] focus-visible:outline-none";

const buttonVariantClasses: Record<FormActionButtonVariant, string> = {
  primary:
    "border-brand-primary bg-brand-primary text-white hover:border-brand-primary/90 hover:bg-brand-primary/90",
  secondary:
    "border-border-subtle bg-white text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/3",
};

const disabledButtonClass = "cursor-not-allowed opacity-50";

const FormActionButton = ({
  variant,
  className,
  children,
  disabled,
  isLoading = false,
  loadingText,
  type = "button",
  ...buttonProps
}: FormActionButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        baseButtonClass,
        buttonVariantClasses[variant],
        (disabled || isLoading) && disabledButtonClass,
        className,
      )}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText ?? children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default FormActionButton;
