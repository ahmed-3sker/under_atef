import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protected_route";
import { AuthProvider } from "./components/auth_provider";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Reports from "./pages/reports";
import ClassesList from "./pages/Class_list";
import Attendance from "./pages/Attendance";
import Students from "./pages/Students";
import StudentDashboard from "./pages/student_dashboard";
import Users from "./pages/Users";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* any logged-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDashboard />} />

            {/* teachers + admins take attendance */}
            <Route element={<ProtectedRoute roles={["teacher", "admin"]} />}>
              <Route path="/attendance" element={<ClassesList />} />
              <Route path="/attendance/:classId" element={<Attendance />} />
            </Route>

            {/* principal + admins read reports */}
            <Route element={<ProtectedRoute roles={["principal", "admin"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* admins only */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>

          <Route path="/classes" element={<Navigate to="/attendance" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
