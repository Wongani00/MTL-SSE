import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import HorizontalLine from "../components/HorizontalLine";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Home</title>
        <meta
          name="description"
          content="Welcome to the Home Page of our application."
        />
        <meta property="og:title" content="Home Page" />
      </Helmet>

      <div className="font-sans bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 items-center">
              <div className="text-white">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-yellow-500 text-lg font-medium">
                    Welcome to SSE Portal
                    <span className="text-[26px] ml-[2px]">!</span>
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  Streamline Your
                  <span className="text-yellow-500"> Service Delivery</span>
                  Workflow
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Automate project tracking, coordinate cross-department
                  workflows, and deliver{" "}
                  <span className="font-bold text-3xl text-yellow-500">
                    MTL's
                  </span>{" "}
                  services faster with this comprehensive management system.
                </p>

                {/* Value Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">Reduce Project Delays</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Cross-Department Coordination
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Complete Project Visibility
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-3 h-3 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Automated Notifications
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <NavLink to="/projects">
                    <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-8 rounded-lg cursor-pointer transition duration-200 transform hover:scale-105 shadow-lg">
                      Go to projects
                    </button>
                  </NavLink>
                  <NavLink to="/dashboard">
                    <button className="border border-gray-600 hover:border-gray-400 text-white font-medium py-3 px-8 rounded-lg cursor-pointer transition duration-200 hover:bg-white/5">
                      Dashboard
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">47</div>
                <div className="text-gray-600 text-sm mt-1">
                  Projects This Month
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">92%</div>
                <div className="text-gray-600 text-sm mt-1">
                  On-Time Delivery
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">156</div>
                <div className="text-gray-600 text-sm mt-1">Active Stages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">8</div>
                <div className="text-gray-600 text-sm mt-1">
                  Teams Coordinated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-1">
              Department Quick Access
            </h2>
            <HorizontalLine />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Commercial Team */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-none hover:-translate-y-1 transition duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Commercial Team
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    New Project
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Pending Quotes
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Customer Communications
                  </button>
                </div>
              </div>

              {/* Solutions Team */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-none hover:-translate-y-1 transition duration-200">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Solutions Team
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Design Queue
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Technical Specs
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    BOQ Management
                  </button>
                </div>
              </div>

              {/* Technical Team */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-none hover:-translate-y-1 transition duration-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Technical Team
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Survey Schedule
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Configuration Queue
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Installation Prep
                  </button>
                </div>
              </div>

              {/* Finance */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-none hover:-translate-y-1 transition duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Finance
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Awaiting Payment
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Invoice Review
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1">
                    Revenue Tracking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
