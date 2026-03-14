import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";

import type { SignupFormValues } from "../types/signup";

const OTP_LENGTH = 4;
const RESEND_DELAY_SECONDS = 10;

function createEmptyOtpDigits() {
  return Array.from({ length: OTP_LENGTH }, () => "");
}

export function OtpVerificationStep() {
  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const [otpDigits, setOtpDigits] = useState(() => {
    const currentOtp = getValues("otp");

    if (currentOtp.length === OTP_LENGTH) {
      return currentOtp.split("").slice(0, OTP_LENGTH);
    }

    return createEmptyOtpDigits();
  });
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpError = errors.otp?.message;
  const shouldShowOtpError = Boolean(otpError);
  const otpInputBorderClass = otpError ? "border-required-indicator" : "border-brand-primary/30";
  const otpInputHoverClass = otpError
    ? "hover:border-required-indicator/80"
    : "hover:border-brand-primary/55";
  const otpInputFocusClass = otpError
    ? "focus:border-required-indicator focus:shadow-[0_0_0_3px_rgba(255,124,82,0.18)]"
    : "focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(0,84,253,0.2)]";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function updateOtpDigits(nextDigits: string[]) {
    setOtpDigits(nextDigits);
    setValue("otp", nextDigits.join(""));
  }

  function focusInput(index: number) {
    inputRefs.current[index]?.focus();
  }

  async function handleOtpChange(index: number, rawValue: string) {
    const numericValue = rawValue.replace(/\D/g, "");

    if (!numericValue) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      updateOtpDigits(nextDigits);
      if (otpError) {
        await trigger("otp");
      }
      return;
    }

    const lastEnteredDigit = numericValue[numericValue.length - 1];
    const nextDigits = [...otpDigits];
    nextDigits[index] = lastEnteredDigit;
    updateOtpDigits(nextDigits);
    if (otpError) {
      await trigger("otp");
    }

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") {
      return;
    }

    if (otpDigits[index]) {
      return;
    }

    if (index > 0) {
      const previousIndex = index - 1;
      const nextDigits = [...otpDigits];
      nextDigits[previousIndex] = "";
      updateOtpDigits(nextDigits);
      focusInput(previousIndex);
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (pastedDigits.length === 0) {
      return;
    }

    const nextDigits = createEmptyOtpDigits();

    pastedDigits.forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    updateOtpDigits(nextDigits);
    if (otpError) {
      void trigger("otp");
    }
    focusInput(Math.min(pastedDigits.length, OTP_LENGTH) - 1);
  }

  function handleResendClick() {
    if (secondsUntilResend > 0) {
      return;
    }

    setSecondsUntilResend(RESEND_DELAY_SECONDS);
  }

  useEffect(() => {
    if (secondsUntilResend === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsUntilResend((currentValue) => Math.max(currentValue - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsUntilResend]);

  return (
    <section className="w-full">
      <h2 className="text-xl font-medium text-text-primary lg:text-2xl">OTP Verification</h2>
      <div className="mt-[54px] w-full max-w-fit" onPaste={handleOtpPaste}>
        <p className="mb-2 text-xs text-text-muted">An OTP has been sent to your mobile number</p>

        <div className="flex gap-3 sm:gap-5 lg:gap-9">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              aria-label={`OTP digit ${index + 1}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => handleOtpKeyDown(index, event)}
              className={`h-14 w-14 rounded-xl border ${otpInputBorderClass} ${otpInputHoverClass} ${otpInputFocusClass} text-center text-base text-text-primary outline-none sm:h-16 sm:w-16 lg:h-[70px] lg:w-[70px]`}
            />
          ))}
        </div>

        {shouldShowOtpError && otpError ? (
          <p className="mt-3 text-base text-required-indicator">{otpError}</p>
        ) : null}
        <p className="mt-6 text-right text-sm font-normal text-text-primary">
          Did not receive OTP?{" "}
          <button
            type="button"
            onClick={handleResendClick}
            disabled={secondsUntilResend > 0}
            className="text-xs font-medium text-brand-primary disabled:text-text-muted"
          >
            {secondsUntilResend > 0 ? `Resend OTP in ${secondsUntilResend}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </section>
  );
}
