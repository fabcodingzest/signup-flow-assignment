import { useNavigate } from "react-router-dom";

import { FormActionButton } from "../components/FormActionButton";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-[640px] rounded-2xl bg-white px-6 py-10 text-center shadow-panel sm:px-10">
        <p className="text-sm text-text-muted">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold text-text-primary">Welcome</h1>
        <p className="mt-3 text-base text-text-muted">
          This is a simple placeholder dashboard route for the assignment flow.
        </p>

        <div className="mt-8 flex justify-center">
          <FormActionButton variant="secondary" onClick={() => navigate("/")}>
            Sign out
          </FormActionButton>
        </div>
      </div>
    </div>
  );
}
