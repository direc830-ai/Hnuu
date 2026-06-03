import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthSync from "./components/AuthSync";

import LandingPage from "./pages/Home.jsx";
import About from "./pages/About";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Dashboard from "./pages/DashboardFinal.jsx";
import InteractiveMaps from "./pages/InteractiveMaps";
import Settings from "./pages/Settings";
import Profile from "./pages/ProfileNew.jsx";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminMapEditor from "./pages/AdminMapEditor";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <AuthSync />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interactive-maps" element={<InteractiveMaps />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        
        {/* Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Layout Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="maps" element={<AdminMapEditor />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;