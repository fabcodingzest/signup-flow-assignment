import type { ComponentType } from "react";
import type { InferType } from "yup";

import type { signupSchema } from "../validation/signupSchema";

export type SignupFormValues = InferType<typeof signupSchema>;

export interface SubmittedSummary {
  accountType: string;
  fullName: string;
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
