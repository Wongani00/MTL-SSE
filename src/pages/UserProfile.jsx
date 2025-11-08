import React from "react";
import { FaUserCircle } from "react-icons/fa";
import UserPic from "../assets/user.webp";

const UserProfile = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="mb-8 text-center">
            {/* <h1 className="text-3xl font-md text-gray-900">
              User Profile
            </h1> */}
            <p className="text-xl text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <img src={UserPic} alt="user profile" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Wongani Nyirenda
                  </h2>
                  <p className="text-blue-600 font-medium mt-1">
                    Commercial Team
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-3">
                    <svg
                      className="w-2 h-2 mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Active
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Projects Created</span>
                    <span className="font-semibold text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-900">
                      Jan 2024
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Department</span>
                    <p className="font-medium text-gray-900">Commercial</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Role</span>
                    <p className="font-medium text-gray-900">Sales Executive</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">CCO</span>
                    <p className="font-medium text-gray-900">Nyasha Chidoola</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <button className="hidden text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      Wongani Nyirenda
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      wonganikaunga726@gmail.com
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      +265 886-873-712
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      EMP-2024-001
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Security Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">
                        Last changed 2 weeks ago
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Change Password
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      Enable
                    </button>
                  </div>

                  {/* <div className="flex justify-between items-center py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Login Sessions
                      </h4>
                      <p className="text-sm text-gray-600">
                        Manage your active sessions
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View All
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
