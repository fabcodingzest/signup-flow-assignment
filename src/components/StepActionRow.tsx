import type { PropsWithChildren } from "react";

type StepActionRowProps = PropsWithChildren<{
  className?: string;
}>;

export function StepActionRow({ children, className = "" }: StepActionRowProps) {
  return (
    <div className={`mt-6 flex justify-center gap-3 sm:gap-4 lg:justify-start ${className}`}>
      {children}
    </div>
  );
}
