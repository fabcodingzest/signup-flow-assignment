import type { ChangeEvent } from "react";
import type { FieldPath, UseFormTrigger } from "react-hook-form";

import type { SignupFormValues } from "../types/signup";

export const formFieldLabelClass = "mb-2 block text-sm font-normal text-text-muted";

export const formFieldInputBaseClass =
  "w-full rounded-xl bg-white font-normal text-base text-text-primary outline-none placeholder:text-text-primary/25";

export const formFieldErrorClass = "text-base text-required-indicator";

export function getFormFieldStateClasses(hasError: boolean) {
  if (hasError) {
    return {
      borderClass: "border-required-indicator",
      hoverClass: "hover:border-required-indicator/80",
      focusClass:
        "focus-visible:border-required-indicator focus-visible:shadow-[0_0_0_3px_rgba(255,124,82,0.18)]",
    };
  }

  return {
    borderClass: "border-brand-primary/30",
    hoverClass: "hover:border-brand-primary/55",
    focusClass:
      "focus-visible:border-brand-primary focus-visible:shadow-[0_0_0_3px_rgba(0,84,253,0.2)]",
  };
}

type RevalidateOnChangeOptions = {
  event: ChangeEvent<HTMLInputElement | HTMLSelectElement>;
  onChange: (value: string) => void;
  shouldValidate: boolean;
  trigger: UseFormTrigger<SignupFormValues>;
  fields: FieldPath<SignupFormValues> | ReadonlyArray<FieldPath<SignupFormValues>>;
  transformValue?: (value: string) => string;
};

export async function handleFieldChangeWithRevalidation({
  event,
  onChange,
  shouldValidate,
  trigger,
  fields,
  transformValue,
}: RevalidateOnChangeOptions) {
  const nextValue = transformValue ? transformValue(event.target.value) : event.target.value;

  onChange(nextValue);

  if (shouldValidate) {
    await trigger(fields);
  }
}
