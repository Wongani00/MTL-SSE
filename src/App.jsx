import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UniversalLayout from "./Layouts/UniversalLayout.jsx";
import Projects from "./pages/Projects.jsx";
import Admin from "./pages/Admin.jsx";
import Reports from "./pages/Reports.jsx";
import NotFound from "./pages/errors/NotFound.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./hooks/UseAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SignUp from "./pages/SignUp.jsx";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UniversalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/projects" element={<Projects />} />
          <Route
            path="home/admin"
            element={
              <ProtectedRoute requiredRole={["Admin", "SuperAdmin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="home/reports" element={<Reports />} />
          <Route path="home/profile" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return (
    <AuthProvider>
      <div>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;
