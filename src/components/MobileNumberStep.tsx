import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Controller, useFormContext } from "react-hook-form";

import {
  formFieldErrorClass,
  formFieldLabelClass,
  getFormFieldStateClasses,
  handleFieldChangeWithRevalidation,
} from "../utils/formFieldUtils";
import type { SignupFormValues } from "../types/signup";

const MobileNumberStep = () => {
  const {
    control,
    setFocus,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const mobileNumberError = errors.mobileNumber?.message;
  const { borderClass, hoverClass, focusClass } = getFormFieldStateClasses(
    Boolean(mobileNumberError),
  );
  const shouldValidateOnChange = touchedFields.mobileNumber || Boolean(errors.mobileNumber);

  useEffect(() => {
    setFocus("countryCode");
  }, [setFocus]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-medium text-text-primary lg:text-2xl">OTP Verification</h2>

      <div className="mt-[54px]">
        <label htmlFor="mobile-number" className={formFieldLabelClass}>
          Mobile Number<span className="text-required-indicator">*</span>
        </label>

        <div className="flex gap-3">
          <div className="relative w-[116px] shrink-0">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <select
                  aria-label="Country code"
                  {...field}
                  onChange={(event) =>
                    handleFieldChangeWithRevalidation({
                      event,
                      onChange: field.onChange,
                      shouldValidate: shouldValidateOnChange,
                      trigger,
                      fields: "mobileNumber",
                    })
                  }
                  className={`w-full appearance-none rounded-xl border ${borderClass} ${hoverClass} ${focusClass} bg-white px-3 py-4 text-sm text-text-muted outline-none sm:py-5 sm:text-base lg:py-6.5`}
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
                onChange={(event) =>
                  handleFieldChangeWithRevalidation({
                    event,
                    onChange: field.onChange,
                    shouldValidate: shouldValidateOnChange,
                    trigger,
                    fields: "mobileNumber",
                    transformValue: (value) => value.replace(/\D/g, ""),
                  })
                }
                placeholder="Your mobile number"
                className={`min-w-0 flex-1 placeholder:text-text-muted rounded-xl border ${borderClass} ${hoverClass} ${focusClass} bg-white px-3 py-4 text-sm text-text-primary outline-none placeholder:text-text-primary/45 sm:py-5 sm:text-base lg:py-6.5`}
              />
            )}
          />
        </div>

        {mobileNumberError ? (
          <p className={`mt-2 ${formFieldErrorClass}`}>{mobileNumberError}</p>
        ) : null}
      </div>
    </section>
  );
};

export default MobileNumberStep;
