import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Controller, useFormContext, useWatch, type FieldPath } from "react-hook-form";

import {
  getFormFieldStateClasses,
  handleFieldChangeWithRevalidation,
  formFieldInputBaseClass,
  formFieldLabelClass,
} from "../utils/formFieldUtils";
import type { SignupFormValues } from "../types/signup";

type PasswordFieldProps = {
  fieldName: "password" | "confirmPassword";
  inputId: string;
  label: string;
  placeholder: string;
  helperText: string;
  inputType: "password" | "text";
  toggleLabel: string;
  onToggleVisibility: () => void;
};

const PasswordField = ({
  fieldName,
  helperText,
  toggleLabel,
  inputId,
  inputType,
  label,
  onToggleVisibility,
  placeholder,
}: PasswordFieldProps) => {
  const {
    control,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const fieldError = errors[fieldName]?.message;
  const fieldStateClasses = getFormFieldStateClasses(Boolean(fieldError));
  const shouldValidateOnChange = touchedFields[fieldName] || Boolean(fieldError);

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });
  const validateFields =
    fieldName === "password" && confirmPassword
      ? (["password", "confirmPassword"] as FieldPath<SignupFormValues>[])
      : fieldName;

  const helperTextClassName = fieldError
    ? "text-required-indicator"
    : fieldName === "password"
      ? password.length >= 6
        ? "text-success-indicator"
        : "text-text-muted"
      : confirmPassword && confirmPassword === password
        ? "text-success-indicator"
        : "text-text-muted";
  return (
    <>
      <label htmlFor={inputId} className={formFieldLabelClass}>
        {label}
      </label>

      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              id={inputId}
              type={inputType}
              placeholder={placeholder}
              onChange={(event) =>
                handleFieldChangeWithRevalidation({
                  event,
                  onChange: field.onChange,
                  shouldValidate: shouldValidateOnChange,
                  trigger,
                  fields: validateFields,
                })
              }
              className={`${formFieldInputBaseClass} border ${fieldStateClasses.borderClass} ${fieldStateClasses.hoverClass} ${fieldStateClasses.focusClass} p-4 pr-12 sm:p-5 sm:pr-14 lg:p-6.5 lg:pr-14`}
            />

            <button
              type="button"
              onClick={onToggleVisibility}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-primary sm:right-5"
              aria-label={toggleLabel}
            >
              {inputType === "text" ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      />

      <p className={`mt-2 ${helperTextClassName}`}>{helperText}</p>
    </>
  );
};

const PasswordStep = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setFocus } = useFormContext<SignupFormValues>();

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-medium text-text-primary lg:text-2xl">
        Create Password for your account
      </h2>

      <div className="mt-[54px]">
        <PasswordField
          fieldName="password"
          helperText="Must be atleast 6 characters"
          inputId="password"
          inputType={showPassword ? "text" : "password"}
          label="Enter new password"
          onToggleVisibility={() => setShowPassword((currentValue) => !currentValue)}
          placeholder="Enter new password"
          toggleLabel={showPassword ? "Hide password" : "Show password"}
        />
      </div>

      <div className="mt-4">
        <PasswordField
          fieldName="confirmPassword"
          helperText="Both passwords must match"
          inputId="confirm-password"
          inputType={showConfirmPassword ? "text" : "password"}
          label="Confirm password"
          onToggleVisibility={() => setShowConfirmPassword((currentValue) => !currentValue)}
          placeholder="Confirm password"
          toggleLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
        />
      </div>
    </section>
  );
};

export default PasswordStep;
