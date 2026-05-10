import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import GlobalNetworkLoader from "./components/GlobalNetworkLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "./layouts/AppShell";
import PublicLayout from "./layouts/PublicLayout";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";

const App = () => (
  <AuthProvider>
    <GlobalNetworkLoader />

    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/contact" element={<LandingPage />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/team" element={<TeamPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0f172a",
          color: "#e2e8f0",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    />
  </AuthProvider>
);

export default App;
