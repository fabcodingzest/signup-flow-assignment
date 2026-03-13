import type { ComponentType } from "react";

export interface SignupFormValues {
  accountType: string;
  countryCode: string;
  mobileNumber: string;
}

export interface StepConfig {
  id: string;
  title?: string;
  highlightedTitle?: string;
  description?: string;
  fields?: Array<keyof SignupFormValues>;
  component: ComponentType;
}
