import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protected_route";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/auth_provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/pages/Login.tsx" element={<Login />} />
\
          {/* Any Logged in batatis */}

          {/* <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path="/" /> */}

            {/* Atef & Admins */}


            {/* <Route element={<ProtectedRoute roles={["principal", "admin"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
            </Route> */}

            {/* Teachers */}

            {/* <Route element={<ProtectedRoute roles={["teacher"]} />}>
              <Route path="/attendance" element={<ClassesList />} />
              <Route path="/attendance/:classId" element={<Attendance />} />
            </Route> */}

            {/* teachers and admins */}


            {/* all */}

            {/* <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} /> */}

            {/* hazoro & asker only */}

            {/* <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/users" element={<Users />} />
            </Route>
          </Route> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
