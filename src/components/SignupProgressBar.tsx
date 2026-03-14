type SignupProgressBarProps = {
  isComplete: boolean;
  totalSteps: number;
  currentStepIndex: number;
};

export function SignupProgressBar({
  isComplete,
  totalSteps,
  currentStepIndex,
}: SignupProgressBarProps) {
  const progressPercent = isComplete
    ? 100
    : Math.min(((currentStepIndex + 1) / totalSteps) * 100, 100);

  return (
    <div className="h-[5px] w-full">
      <div
        className="h-full rounded-full bg-brand-primary transition-[width] duration-300"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
