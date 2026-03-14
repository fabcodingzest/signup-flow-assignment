import { FiCheck, FiShield } from "react-icons/fi";

import FormActionButton from "./FormActionButton";

type SignupSummaryModalProps = {
  accountType: string;
  fullName: string;
  isOpen: boolean;
  mobileNumber: string;
  onConfirm: () => void;
  onClose: () => void;
};

const SignupSummaryModal = ({
  accountType,
  fullName,
  isOpen,
  mobileNumber,
  onConfirm,
  onClose,
}: SignupSummaryModalProps) => {
  const summaryRows = [
    { label: "Account Type", value: accountType, valueClassName: "capitalize" },
    { label: "Name", value: fullName || "-", valueClassName: "" },
    { label: "Mobile Number", value: mobileNumber, valueClassName: "" },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-[fade-in_200ms_ease-out] items-center justify-center overflow-y-auto bg-[#132C4A]/35 px-4 py-6 sm:px-6"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={-1}
    >
      <div
        className="w-full max-w-[479px] animate-[fade-in_200ms_ease-out] rounded-2xl bg-white px-5 py-8 shadow-[0_24px_80px_rgba(19,44,74,0.18)] sm:px-6 sm:py-9"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-9.5 w-9.5 items-center justify-center rounded-full border-2 border-brand-primary text-brand-primary">
          <FiCheck className="h-6 w-6" />
        </div>

        <h2 className="mt-2 text-center text-2xl font-open-sans font-semibold leading-none text-text-primary">
          You&apos;re all set!
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Here&apos;s a quick summary of your account details
        </p>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-surface-muted px-6 py-4">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-text-muted">{row.label}</span>
              <span className={`font-medium text-text-primary ${row.valueClassName}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start justify-center gap-2 text-xs text-text-muted">
          <span className="relative flex h-4 w-4 items-center justify-center text-success-indicator">
            <FiShield className="h-4 w-4" />
            <FiCheck className="absolute h-2.5 w-2.5" />
          </span>
          <p>Your account is secured with bank-grade security</p>
        </div>

        <div className="mt-8 flex justify-center">
          <FormActionButton variant="primary" onClick={onConfirm} autoFocus>
            Go To Dashboard
          </FormActionButton>
        </div>
      </div>
    </div>
  );
};

export default SignupSummaryModal;
