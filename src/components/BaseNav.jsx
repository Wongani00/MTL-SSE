import React, { useState } from "react";
import {
  FiMenu as Menu,
  FiX as X,
  FiLayout as DashboardIcon,
  FiFolder as ProjectsIcon,
  FiShield as AdminIcon,
  FiBarChart2 as ReportsIcon,
} from "react-icons/fi";
import { CiHome as HomeIcon } from "react-icons/ci";
import ImgLog from "../assets/mtl-logo-75.png";
import { NavLink, Outlet } from "react-router-dom";

const BaseNav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "Dashboard", icon: DashboardIcon, to: "/dashboard" },
    { name: "Projects", icon: ProjectsIcon, to: "/projects" },
    { name: "Admin", icon: AdminIcon, to: "/admin" },
    { name: "Reports", icon: ReportsIcon, to: "/reports" },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          {/* Company Log */}
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full flex items-center justify-center">
              <img
                src={ImgLog}
                alt="logo"
                className="w-24 h-12 cursor hover:cursor-pointer"
              />
              <button className="md:hidden absolute right-4 top-8 cursor-pointer p-2 rounded-md hover:cursor-pointer hover:bg-gray-100">
                {
                  <X
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    size={24}
                  />
                }
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b shadow-lg border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md cursor-pointer hover:cursor-pointer hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 max-w-2xl bg-gray-100 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-cm z-40 transition-opacity duration-500 ease-in-out lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default BaseNav;
