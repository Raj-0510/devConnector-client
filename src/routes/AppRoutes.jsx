import { Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import SignupPage from "../components/SignupPage";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Network from "../pages/Network";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/network" element={<Network />} />
      <Route
        path="*"
        element={<div className="text-center mt-20">404 Not found</div>}
      />
    </Routes>
  );
};
export default AppRoutes;
