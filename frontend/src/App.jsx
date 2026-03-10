import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import RepositoriesPage from "./pages/RepositoriesPage";
import AIToolsPage from "./pages/AIToolsPage";
import IDEPage from "./pages/IDEPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingSpinner from "./components/LoadingSpinner";
import "./pages/pages.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Authenticating..." />;
  return user ? children : <Navigate to="/" replace />;
}

function AppLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner message="Loading Aetheros..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>}
      />
      <Route
        path="/repositories"
        element={<PrivateRoute><AppLayout><RepositoriesPage /></AppLayout></PrivateRoute>}
      />
      <Route
        path="/ai-tools"
        element={<PrivateRoute><AppLayout><AIToolsPage /></AppLayout></PrivateRoute>}
      />
      <Route
        path="/ide"
        element={<PrivateRoute><AppLayout><IDEPage /></AppLayout></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute><AppLayout><ProfilePage /></AppLayout></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
