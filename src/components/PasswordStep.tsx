import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import {
  getFormFieldStateClasses,
  handleFieldChangeWithRevalidation,
  formFieldInputBaseClass,
  formFieldLabelClass,
} from "../utils/formFieldUtils";
import type { SignupFormValues } from "../types/signup";

type PasswordFieldProps = {
  control: ReturnType<typeof useFormContext<SignupFormValues>>["control"];
  fieldName: "password" | "confirmPassword";
  fieldStateClasses: ReturnType<typeof getFormFieldStateClasses>;
  helperText: string;
  helperTextClassName: string;
  inputId: string;
  inputType: "password" | "text";
  label: string;
  onToggleVisibility: () => void;
  placeholder: string;
  shouldValidateOnChange: boolean;
  toggleLabel: string;
  trigger: ReturnType<typeof useFormContext<SignupFormValues>>["trigger"];
  validateFields: "password" | "confirmPassword" | Array<"password" | "confirmPassword">;
};

const PasswordField = ({
  control,
  fieldName,
  fieldStateClasses,
  helperText,
  helperTextClassName,
  inputId,
  inputType,
  label,
  onToggleVisibility,
  placeholder,
  shouldValidateOnChange,
  toggleLabel,
  trigger,
  validateFields,
}: PasswordFieldProps) => {
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
  const {
    control,
    setFocus,
    trigger,
    formState: { errors, touchedFields },
  } = useFormContext<SignupFormValues>();

  const password = useWatch({
    control,
    name: "password",
  });
  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;
  const passwordFieldClasses = getFormFieldStateClasses(Boolean(passwordError));
  const confirmPasswordFieldClasses = getFormFieldStateClasses(Boolean(confirmPasswordError));
  const shouldValidatePasswordOnChange = touchedFields.password || Boolean(passwordError);
  const shouldValidateConfirmPasswordOnChange =
    touchedFields.confirmPassword || Boolean(confirmPasswordError);
  const passwordHelperClass = passwordError
    ? "text-required-indicator"
    : password.length >= 6
      ? "text-success-indicator"
      : "text-text-muted";

  const confirmHelperClass = confirmPasswordError
    ? "text-required-indicator"
    : confirmPassword && confirmPassword === password
      ? "text-success-indicator"
      : "text-text-muted";

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
          control={control}
          fieldName="password"
          fieldStateClasses={passwordFieldClasses}
          helperText="Must be atleast 6 characters"
          helperTextClassName={passwordHelperClass}
          inputId="password"
          inputType={showPassword ? "text" : "password"}
          label="Enter new password"
          onToggleVisibility={() => setShowPassword((currentValue) => !currentValue)}
          placeholder="Enter new password"
          shouldValidateOnChange={shouldValidatePasswordOnChange || Boolean(confirmPassword)}
          toggleLabel={showPassword ? "Hide password" : "Show password"}
          trigger={trigger}
          validateFields={confirmPassword ? ["password", "confirmPassword"] : "password"}
        />
      </div>

      <div className="mt-4">
        <PasswordField
          control={control}
          fieldName="confirmPassword"
          fieldStateClasses={confirmPasswordFieldClasses}
          helperText="Both passwords must match"
          helperTextClassName={confirmHelperClass}
          inputId="confirm-password"
          inputType={showConfirmPassword ? "text" : "password"}
          label="Confirm password"
          onToggleVisibility={() => setShowConfirmPassword((currentValue) => !currentValue)}
          placeholder="Confirm password"
          shouldValidateOnChange={shouldValidateConfirmPasswordOnChange}
          toggleLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          trigger={trigger}
          validateFields="confirmPassword"
        />
      </div>
    </section>
  );
};

export default PasswordStep;
