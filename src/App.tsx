import { Route, Routes } from "react-router-dom";

import { DashboardPage } from "./pages/DashboardPage";
import { SignupFlowPage } from "./pages/SignupFlowPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignupFlowPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
