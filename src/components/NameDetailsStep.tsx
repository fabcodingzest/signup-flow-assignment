import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  formFieldErrorClass,
  formFieldInputBaseClass,
  formFieldLabelClass,
  getFormFieldStateClasses,
  handleFieldChangeWithRevalidation,
} from "../utils/formFieldUtils";
import type { SignupFormValues } from "../types/signup";

type NameFieldProps = {
  fieldName: "firstName" | "lastName";
  inputId: string;
  label: string;
  placeholder: string;
  isRequired?: boolean;
};

const NameField = ({
  fieldName,
  inputId,
  isRequired = false,
  label,
  placeholder,
}: NameFieldProps) => {
  const {
    control,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const fieldError = errors[fieldName]?.message;
  const fieldStateClasses = getFormFieldStateClasses(Boolean(fieldError));
  const shouldValidateOnChange = touchedFields[fieldName] || Boolean(fieldError);

  return (
    <>
      <label htmlFor={inputId} className={formFieldLabelClass}>
        {label}
        {isRequired ? <span className="text-required-indicator">*</span> : null}
      </label>

      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            id={inputId}
            type="text"
            placeholder={placeholder}
            onChange={(event) =>
              handleFieldChangeWithRevalidation({
                event,
                onChange: field.onChange,
                shouldValidate: shouldValidateOnChange,
                trigger,
                fields: fieldName,
              })
            }
            className={`${formFieldInputBaseClass} border ${fieldStateClasses.borderClass} ${fieldStateClasses.hoverClass} ${fieldStateClasses.focusClass} p-4 sm:p-5 lg:p-6.5`}
          />
        )}
      />

      {fieldError ? <p className={`mt-2 ${formFieldErrorClass}`}>{fieldError}</p> : null}
    </>
  );
};

const NameDetailsStep = () => {
  const { setFocus } = useFormContext<SignupFormValues>();

  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-medium text-text-primary lg:text-2xl">What is your name?</h2>

      <div className="mt-[54px]">
        <NameField
          fieldName="firstName"
          inputId="first-name"
          isRequired
          label="First Name"
          placeholder="Oliver"
        />
      </div>

      <div className="mt-4">
        <NameField
          fieldName="lastName"
          inputId="last-name"
          label="Last Name"
          placeholder="Last Name"
        />
      </div>
    </section>
  );
};

export default NameDetailsStep;
