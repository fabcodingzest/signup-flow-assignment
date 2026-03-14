import AccountTypeStep from "../components/AccountTypeStep";
import MobileNumberStep from "../components/MobileNumberStep";
import NameDetailsStep from "../components/NameDetailsStep";
import OtpVerificationStep from "../components/OtpVerificationStep";
import PasswordStep from "../components/PasswordStep";
import type { StepConfig } from "../types/signup";

export const signupSteps: StepConfig[] = [
  {
    id: "account-type",
    title: "To join us tell us",
    highlightedTitle: "what type of account",
    description: "you are opening",
    fields: ["accountType"],
    component: AccountTypeStep,
  },
  {
    id: "mobile-number",
    fields: ["countryCode", "mobileNumber"],
    component: MobileNumberStep,
  },
  {
    id: "otp",
    fields: ["otp"],
    component: OtpVerificationStep,
  },
  {
    id: "name-details",
    fields: ["firstName", "lastName"],
    component: NameDetailsStep,
  },
  {
    id: "password",
    fields: ["password", "confirmPassword"],
    component: PasswordStep,
  },
];
