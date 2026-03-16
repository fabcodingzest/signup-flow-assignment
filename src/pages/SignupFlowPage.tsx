import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import FormActionButton from "../components/FormActionButton";
import SignupProgressBar from "../components/SignupProgressBar";
import SignupSummaryModal from "../components/SignupSummaryModal";
import StepActionRow from "../components/StepActionRow";
import { signupSteps } from "../config/signupSteps";
import type { SignupFormValues, SubmittedSummary } from "../types/signup";
import { mockApiDelay } from "../utils/mockApi";
import { signupSchema } from "../validation/signupSchema";
import Illustration from "../assets/illustration.png";

const stepActionButtonLayoutClass = "min-w-0 flex-1 lg:max-w-none lg:flex-1";

const SignupFlowPage = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState<SubmittedSummary | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      accountType: "personal",
      countryCode: "+1",
      mobileNumber: "",
      otp: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, getValues, trigger } = form;
  const currentStep = signupSteps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === signupSteps.length - 1;
  const accountType = useWatch({
    control,
    name: "accountType",
  });
  const otp = useWatch({
    control,
    name: "otp",
  });
  const isOtpStep = currentStepIndex === 2;

  const isContinueLoading = isOtpStep ? isVerifyingOtp : isSubmitting;
  const isContinueDisabled =
    isContinueLoading || (isFirstStep && !accountType) || (isOtpStep && otp.length !== 4);

  const loadingText = isOtpStep ? "Verifying..." : "Submitting...";

  async function handleContinueClick() {
    if (isContinueLoading) {
      return;
    }

    const fieldsToValidate = currentStep.fields ?? [];

    if (fieldsToValidate.length > 0) {
      const isStepValid = await trigger(fieldsToValidate);

      if (!isStepValid) {
        return;
      }
    }

    if (isOtpStep) {
      setIsVerifyingOtp(true);
      await mockApiDelay();
      setIsVerifyingOtp(false);
      setCurrentStepIndex((i) => i + 1);
      return;
    }

    if (isLastStep) {
      setIsSubmitting(true);
      await mockApiDelay();
      setIsSubmitting(false);
      const submittedValues = getValues();
      setSubmittedSummary({
        accountType: submittedValues.accountType,
        fullName: [submittedValues.firstName, submittedValues.lastName].filter(Boolean).join(" "),
        mobileNumber: `${submittedValues.countryCode} ${submittedValues.mobileNumber}`,
      });
      setIsSummaryModalOpen(true);
      return;
    }

    setCurrentStepIndex((currentIndex) => Math.min(currentIndex + 1, signupSteps.length - 1));
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen items-start justify-center px-4 py-4 lg:items-center lg:px-0 lg:py-0">
        <div className="flex w-full max-w-[1240px] flex-col gap-4 lg:m-8 lg:h-[calc(100dvh-5rem)] lg:max-h-[800px] lg:flex-row lg:gap-x-6">
          <div className="flex w-full flex-col justify-between sm:items-center lg:w-1/2">
            <div className="text-text-primary w-full sm:max-w-[600px] ">
              <h3 className="text-xl font-thin lg:text-2xl">Let’s get started</h3>
              <h1 className="mt-4 mb-6 text-4xl/[44px] font-bold lg:text-5xl/[54px]">
                Create your account
              </h1>
              <h4 className="text-base font-normal">Follow the steps to create your account</h4>
            </div>

            <div className="hidden pb-8 lg:block">
              <img src={Illustration} alt="illustration" />
            </div>
          </div>

          <div className="flex w-full flex-col lg:h-full lg:w-1/2">
            <div className="w-full max-w-[600px] self-center px-2 sm:px-4 lg:max-w-none lg:self-auto lg:px-8">
              <SignupProgressBar
                currentStepIndex={currentStepIndex}
                totalSteps={signupSteps.length}
                isComplete={isSummaryModalOpen}
              />
            </div>

            <form
              className="mt-1 flex max-h-[700px] h-[calc(100dvh-15rem)] w-full max-w-[600px] flex-col self-center rounded-2xl bg-white px-5 py-6 shadow-panel sm:h-[calc(100dvh-14rem)] sm:px-6 sm:py-7 lg:min-h-[560px] lg:h-full lg:max-w-none lg:self-auto lg:px-16 lg:py-11 overflow-y-auto"
              onSubmit={(event) => {
                event.preventDefault();
                void handleContinueClick();
              }}
            >
              {currentStep.title ? (
                <p className="text-xl font-light text-text-primary lg:text-2xl">
                  {currentStep.title}{" "}
                  {currentStep.highlightedTitle ? (
                    <span className="font-medium">{currentStep.highlightedTitle}</span>
                  ) : null}
                  {currentStep.description ? <> {currentStep.description}</> : null}
                </p>
              ) : null}

              <div className={`w-full`}>
                <CurrentStepComponent />
              </div>

              <StepActionRow className="mt-auto pt-6">
                <FormActionButton
                  variant="secondary"
                  className={stepActionButtonLayoutClass}
                  onClick={() =>
                    setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0))
                  }
                  disabled={isFirstStep || isContinueLoading}
                >
                  Back
                </FormActionButton>
                <FormActionButton
                  variant="primary"
                  className={stepActionButtonLayoutClass}
                  type="submit"
                  disabled={isContinueDisabled}
                  isLoading={isContinueLoading}
                  loadingText={loadingText}
                >
                  Continue
                </FormActionButton>
              </StepActionRow>
            </form>
          </div>
        </div>

        <SignupSummaryModal
          accountType={submittedSummary?.accountType ?? ""}
          fullName={submittedSummary?.fullName ?? ""}
          isOpen={isSummaryModalOpen}
          mobileNumber={submittedSummary?.mobileNumber ?? ""}
          onConfirm={() => navigate("/dashboard")}
          onClose={() => setIsSummaryModalOpen(false)}
        />
      </div>
    </FormProvider>
  );
};

export default SignupFlowPage;
