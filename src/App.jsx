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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<UniversalLayout />}>
          <Route index element={<Home />} />
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/projects" element={<Projects />} />
          <Route path="home/admin" element={<Admin />} />
          <Route path="home/reports" element={<Reports />} />
          <Route path="home/profile" element={<UserProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </>
    )
  );
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
