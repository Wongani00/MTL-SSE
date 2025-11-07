import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu as Menu,
  FiX as X,
  FiLayout as DashboardIcon,
  FiFolder as ProjectsIcon,
  FiShield as AdminIcon,
  FiBarChart2 as ReportsIcon,
} from "react-icons/fi";
import { CiHome as HomeIcon } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import ImgLog from "../assets/mtl-logo-75.png";
import Profile from "../assets/user.png";
import { NavLink, Outlet } from "react-router-dom";

const BaseNav = () => {
  const [profileSignoutPopper, setProfileSignoutPopper] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileSignoutPopper(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "Dashboard", icon: DashboardIcon, to: "/dashboard" },
    { name: "Projects", icon: ProjectsIcon, to: "/projects" },
    { name: "Admin", icon: AdminIcon, to: "/admin" },
    { name: "Reports", icon: ReportsIcon, to: "/reports" },
    { name: "Profile", icon: FaUserCircle, to: "/user-profile" },
  ];

  const toggleDropdown = () => {
    setProfileSignoutPopper(!profileSignoutPopper);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-50 lg:w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto p-6">
          {/* Company Log */}
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full flex items-center justify-center">
              <NavLink to="/">
                <img
                  src={ImgLog}
                  alt="logo"
                  className="w-24 h-12 cursor hover:cursor-pointer"
                />
              </NavLink>
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
        <header className="flex justify-between bg-white border-b shadow-lg border-gray-200 px-4 lg:px-6 py-2 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md cursor-pointer hover:cursor-pointer hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:flex flex-1 max-w-2xl bg-gray-100 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-[20px]">
                Hello!{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-[midnightblue]">
                  Bradley
                </span>
              </h3>
              <div className="relative" ref={dropdownRef}>
                <img
                  src={Profile}
                  alt="profile"
                  className="w-12 h-12 rounded-full cursor-pointer hover:cursor-pointer object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  onClick={toggleDropdown}
                />

                {/* Dropdown Menu */}
                <ul
                  className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg p-2 absolute top-14 right-0 w-48 space-y-1 z-50 transition-all duration-200 ${
                    profileSignoutPopper ? "block" : "hidden"
                  }`}
                >
                  <NavLink to="/user-profile" onClick={toggleDropdown}>
                    <li className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                      Profile
                    </li>
                  </NavLink>
                  <li
                    onClick={toggleDropdown}
                    className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors text-red-600"
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
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
