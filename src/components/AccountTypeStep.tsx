import { FiBriefcase, FiCheck, FiUser } from "react-icons/fi";
import { useFormContext, useWatch } from "react-hook-form";

import type { SignupFormValues } from "../types/signup";

const accountOptions = [
  {
    value: "personal",
    label: "Personal",
    icon: FiUser,
  },
  {
    value: "business",
    label: "Business",
    icon: FiBriefcase,
  },
] as const;

const cardBaseClass =
  "flex cursor-pointer items-center justify-between rounded-2xl border bg-surface-muted p-5 shadow-card transition-all duration-200 focus-within:border-brand-primary focus-within:shadow-[0_0_0_3px_rgba(0,84,253,0.2)]";

const cardSelectedClass = "border-brand-primary text-brand-primary";
const cardUnselectedClass = "border-border-subtle text-text-primary";

export function AccountTypeStep() {
  const { control, setValue } = useFormContext<SignupFormValues>();
  const selectedAccountType = useWatch({
    control,
    name: "accountType",
  });

  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">Account type</legend>

      {accountOptions.map((option) => {
        const isSelected = selectedAccountType === option.value;
        const Icon = option.icon;

        return (
          <label
            key={option.value}
            className={`${cardBaseClass} ${isSelected ? cardSelectedClass : cardUnselectedClass}`}
          >
            <input
              type="radio"
              name="accountType"
              value={option.value}
              checked={isSelected}
              onChange={() => setValue("accountType", option.value, { shouldValidate: true })}
              className="sr-only"
            />

            <div className="flex items-center gap-4">
              <span className="flex h-4 w-4 items-center justify-center">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base leading-none font-medium">{option.label}</span>
            </div>

            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                isSelected ? "bg-brand-primary text-white opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden="true"
            >
              <FiCheck className="h-5 w-5" />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
