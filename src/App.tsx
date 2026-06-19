import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Activity } from "lucide-react";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Skills from "./pages/Skills";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageBlog from "./pages/admin/ManageBlog";
import ManageSkills from "./pages/admin/ManageSkills";
import ManageCertifications from "./pages/admin/ManageCertifications";
import ManageAbout from "./pages/admin/ManageAbout";
import ManageMessages from "./pages/admin/ManageMessages";

// Global Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 1. Private Navigation Guard Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex flex-col justify-center items-center text-center">
        <Activity className="w-8 h-8 text-[#E07B39] animate-spin mb-3" />
        <span className="text-xs font-mono text-[#A0A0B0] tracking-wide animate-pulse">CHECKING_CONSOLE_CREDENTIALS...</span>
      </div>
    );
  }

  if (!currentUser) {
    // Force path authentication redirect
    return <Navigate to="/admin/login" replace />;
  }

  return children as any;
}

// 2. Global Layout Frame (Hides headers/footers in admin paths)
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D1A] text-[#F0F0F0] selection:bg-[#E07B39]/30 selection:text-white">
      {!isAdminPath && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Authentication Gate */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Console Dashboards */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute>
                <ManageProjects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog" 
            element={
              <ProtectedRoute>
                <ManageBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/skills" 
            element={
              <ProtectedRoute>
                <ManageSkills />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/certifications" 
            element={
              <ProtectedRoute>
                <ManageCertifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/about" 
            element={
              <ProtectedRoute>
                <ManageAbout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/messages" 
            element={
              <ProtectedRoute>
                <ManageMessages />
              </ProtectedRoute>
            } 
          />

          {/* Fallback wildcard routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}
