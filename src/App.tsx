import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { FormActionButton } from "./components/FormActionButton";
import { AccountTypeStep } from "./components/AccountTypeStep";
import { MobileNumberStep } from "./components/MobileNumberStep";
import { NameDetailsStep } from "./components/NameDetailsStep";
import { OtpVerificationStep } from "./components/OtpVerificationStep";
import { PasswordStep } from "./components/PasswordStep";
import type { SignupFormValues, StepConfig } from "./types/signup";
import { signupSchema } from "./validation/signupSchema";

const steps: StepConfig[] = [
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
    title: "Enter the",
    highlightedTitle: "verification code",
    description: "we sent to your phone",
    component: OtpVerificationStep,
  },
  {
    id: "name-details",
    title: "Tell us",
    highlightedTitle: "your full name",
    description: "to set up your profile",
    component: NameDetailsStep,
  },
  {
    id: "password",
    title: "Create a",
    highlightedTitle: "secure password",
    description: "for your new account",
    component: PasswordStep,
  },
];

function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      accountType: "personal",
      countryCode: "+1",
      mobileNumber: "",
    },
  });

  const { control, trigger } = form;
  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const accountType = useWatch({
    control,
    name: "accountType",
  });
  const isContinueDisabled = isFirstStep && !accountType;

  async function handleContinueClick() {
    const fieldsToValidate = currentStep.fields ?? [];

    if (fieldsToValidate.length > 0) {
      const isStepValid = await trigger(fieldsToValidate);

      if (!isStepValid) {
        return;
      }
    }

    setCurrentStepIndex((currentIndex) => Math.min(currentIndex + 1, steps.length - 1));
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen items-center justify-center">
        <div className="m-8 flex h-screen max-h-[650px] w-full max-w-[1240px] gap-x-6">
          <div className="left flex w-1/2 flex-col justify-between">
            <div className="text-text-primary">
              <h3 className="text-2xl font-thin">Let’s get started</h3>
              <h1 className="mt-4 mb-6 text-5xl/[54px] font-bold">Create your account</h1>
              <h4 className="text-base font-normal">Follow the steps to create your account</h4>
            </div>

            <div className="pb-8">
              <img src="src/assets/illustration.png" alt="illustration" />
            </div>
          </div>

          <form className="right flex h-full w-1/2 flex-col rounded-2xl bg-white px-16 py-11 shadow-panel">
            {currentStep.title ? (
              <p className="text-2xl font-light text-text-primary">
                {currentStep.title}{" "}
                {currentStep.highlightedTitle ? (
                  <span className="font-medium">{currentStep.highlightedTitle}</span>
                ) : null}
                {currentStep.description ? (
                  <>
                    <br />
                    {currentStep.description}
                  </>
                ) : null}
              </p>
            ) : null}

            <div className={`${currentStep.title ? "mt-10" : ""} w-full flex-1`}>
              <CurrentStepComponent />
            </div>

            <div className="mt-8 flex gap-4">
              <FormActionButton
                variant="secondary"
                className="flex-1"
                onClick={() => setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0))}
                disabled={isFirstStep}
              >
                Back
              </FormActionButton>
              <FormActionButton
                variant="primary"
                className="flex-1"
                onClick={handleContinueClick}
                disabled={isContinueDisabled || isLastStep}
              >
                Continue
              </FormActionButton>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

export default App;
