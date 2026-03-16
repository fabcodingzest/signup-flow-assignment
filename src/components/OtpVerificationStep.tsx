import { useEffect, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useFormContext } from "react-hook-form";

import type { SignupFormValues } from "../types/signup";

const OTP_LENGTH = 4;
const RESEND_DELAY_SECONDS = 10;

const OtpVerificationStep = () => {
  const {
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const [otpDigits, setOtpDigits] = useState<string[]>(() => {
    const saved = getValues("otp");
    if (saved.length === OTP_LENGTH) return saved.split("");
    return Array(OTP_LENGTH).fill("");
  });

  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpError = errors.otp?.message;
  const inputClass = `h-14 w-14 rounded-xl border text-center text-base text-text-primary outline-none sm:h-16 sm:w-16 lg:h-[70px] lg:w-[70px] ${
    otpError
      ? "border-required-indicator hover:border-required-indicator/80 focus:border-required-indicator focus:shadow-[0_0_0_3px_rgba(255,124,82,0.18)]"
      : "border-brand-primary/30 hover:border-brand-primary/55 focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(0,84,253,0.2)]"
  }`;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function updateOtpDigits(nextDigits: string[]) {
    setOtpDigits(nextDigits);
    setValue("otp", nextDigits.join(""));
  }

  async function handleOtpChange(index: number, rawValue: string) {
    // take only the last character entered (handles replacement case)
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    updateOtpDigits(nextDigits);

    if (otpError) await trigger("otp");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    // if cell is filled and a numeric key is pressed, replace it
    if (/^\d$/.test(event.key) && otpDigits[index]) {
      event.preventDefault();
      const nextDigits = [...otpDigits];
      nextDigits[index] = event.key;
      updateOtpDigits(nextDigits);
      if (index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
      return;
    }

    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      const nextDigits = [...otpDigits];
      nextDigits[index - 1] = "";
      updateOtpDigits(nextDigits);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pastedDigits.length) return;

    const nextDigits = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pastedDigits[i] ?? "");

    updateOtpDigits(nextDigits);
    if (otpError) void trigger("otp");
    inputRefs.current[Math.min(pastedDigits.length, OTP_LENGTH) - 1]?.focus();
  }

  function handleResendClick() {
    if (secondsUntilResend > 0) return;
    setSecondsUntilResend(RESEND_DELAY_SECONDS);
  }

  useEffect(() => {
    if (secondsUntilResend === 0) return;
    const timer = window.setTimeout(() => {
      setSecondsUntilResend((v) => Math.max(v - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
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
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              aria-label={`OTP digit ${index + 1}`}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className={inputClass}
            />
          ))}
        </div>
        {otpError && <p className="mt-3 text-base text-required-indicator">{otpError}</p>}
        <p className="mt-6 text-right text-sm font-normal text-text-primary">
          Did not receive OTP?{" "}
          <button
            type="button"
            onClick={handleResendClick}
            disabled={secondsUntilResend > 0}
            className="text-xs font-medium text-brand-primary disabled:text-text-muted cursor-pointer disabled:cursor-not-allowed"
          >
            {secondsUntilResend > 0 ? `Resend OTP in ${secondsUntilResend}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default OtpVerificationStep;
