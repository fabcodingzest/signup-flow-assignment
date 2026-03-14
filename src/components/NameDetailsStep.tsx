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
  error?: string;
  fieldName: "firstName" | "lastName";
  fieldStateClasses: ReturnType<typeof getFormFieldStateClasses>;
  inputId: string;
  isRequired?: boolean;
  label: string;
  placeholder: string;
  shouldValidateOnChange: boolean;
  trigger: ReturnType<typeof useFormContext<SignupFormValues>>["trigger"];
  control: ReturnType<typeof useFormContext<SignupFormValues>>["control"];
};

const NameField = ({
  control,
  error,
  fieldName,
  fieldStateClasses,
  inputId,
  isRequired = false,
  label,
  placeholder,
  shouldValidateOnChange,
  trigger,
}: NameFieldProps) => {
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

      {error ? <p className={`mt-2 ${formFieldErrorClass}`}>{error}</p> : null}
    </>
  );
};

const NameDetailsStep = () => {
  const {
    control,
    setFocus,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const firstNameError = errors.firstName?.message;
  const lastNameError = errors.lastName?.message;
  const firstNameFieldClasses = getFormFieldStateClasses(Boolean(firstNameError));
  const lastNameFieldClasses = getFormFieldStateClasses(Boolean(lastNameError));
  const shouldValidateFirstNameOnChange = touchedFields.firstName || Boolean(firstNameError);
  const shouldValidateLastNameOnChange = touchedFields.lastName || Boolean(lastNameError);

  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-medium text-text-primary lg:text-2xl">What is your name?</h2>

      <div className="mt-[54px]">
        <NameField
          control={control}
          error={firstNameError}
          fieldName="firstName"
          fieldStateClasses={firstNameFieldClasses}
          inputId="first-name"
          isRequired
          label="First Name"
          placeholder="Oliver"
          shouldValidateOnChange={shouldValidateFirstNameOnChange}
          trigger={trigger}
        />
      </div>

      <div className="mt-4">
        <NameField
          control={control}
          error={lastNameError}
          fieldName="lastName"
          fieldStateClasses={lastNameFieldClasses}
          inputId="last-name"
          label="Last Name"
          placeholder="Last Name"
          shouldValidateOnChange={shouldValidateLastNameOnChange}
          trigger={trigger}
        />
      </div>
    </section>
  );
};

export default NameDetailsStep;
