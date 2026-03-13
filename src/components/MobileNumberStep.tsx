import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Controller, useFormContext } from "react-hook-form";

import type { SignupFormValues } from "../types/signup";

export function MobileNumberStep() {
  const {
    control,
    setFocus,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const mobileNumberError = errors.mobileNumber?.message;
  const borderColorClass = mobileNumberError ? "border-required-indicator" : "border-brand-primary/30";
  const focusBorderClass = mobileNumberError
    ? "focus-visible:border-required-indicator focus-visible:shadow-[0_0_0_3px_rgba(255,124,82,0.18)]"
    : "focus-visible:border-brand-primary focus-visible:shadow-[0_0_0_3px_rgba(0,84,253,0.2)]";
  const shouldValidateOnChange = touchedFields.mobileNumber || Boolean(errors.mobileNumber);

  useEffect(() => {
    setFocus("countryCode");
  }, [setFocus]);

  return (
    <section className="w-full">
      <h2 className="text-2xl font-medium text-text-primary">OTP Verification</h2>

      <div className="mt-8">
        <label htmlFor="mobile-number" className="mb-2 block text-sm font-normal text-text-muted">
          Mobile Number<span className="text-required-indicator">*</span>
        </label>

        <div className="flex gap-3">
          <div className="relative w-[93px]">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <select
                  aria-label="Country code"
                  {...field}
                  onChange={async (event) => {
                    field.onChange(event.target.value);

                    if (shouldValidateOnChange) {
                      await trigger("mobileNumber");
                    }
                  }}
                  className={`w-full appearance-none rounded-xl border ${borderColorClass} ${focusBorderClass} bg-white px-3 py-6.5 text-base text-text-muted outline-none`}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
              )}
            />

            <FiChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>

          <Controller
            name="mobileNumber"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="mobile-number"
                type="tel"
                inputMode="numeric"
                required
                onChange={async (event) => {
                  field.onChange(event.target.value.replace(/\D/g, ""));

                  if (shouldValidateOnChange) {
                    await trigger("mobileNumber");
                  }
                }}
                placeholder="Your mobile number"
                className={`flex-1 rounded-xl border ${borderColorClass} ${focusBorderClass} bg-white px-3 py-6.5 text-base text-text-muted outline-none placeholder:text-text-primary/45`}
              />
            )}
          />
        </div>

        {mobileNumberError ? (
          <p className="mt-2 text-base text-required-indicator">{mobileNumberError}</p>
        ) : null}
      </div>
    </section>
  );
}
