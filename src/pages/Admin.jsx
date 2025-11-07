import React from "react";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaUserShield,
  FaMoneyBillWave,
  FaCog,
  FaTools,
} from "react-icons/fa";
import CompanyLogo from "../assets/mtl-logo-75.png";
import Login from "./Login";
import SignUp from "./SignUp";

const Admin = () => {
  return (
    <div>
      <Helmet>
        <title>MTL SSE | Admin Panel</title>
        <meta
          name="description"
          content="Admin Panel - Management of application settings and users."
        />
        <meta property="og:title" content="Admin Panel" />
      </Helmet>
      {/* admin main page content */}
      <div className="max-w-full overflow-hidden">
        {/* top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center">
          {/* Total users */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaUser size={24} color="blue" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Total Users</h1>
              <span className="text-sm">12</span>
            </div>
          </div>
          {/* Total commercial members */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaMoneyBillWave size={24} color="green" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Sales Executives</h1>
              <span className="text-sm">5</span>
            </div>
          </div>
          {/* Total SSE members */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaCog size={24} color="purple" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">SSE members</h1>
              <span className="text-sm">1</span>
            </div>
          </div>
          {/* Total technicians (specifically those from NOC) */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaTools size={24} color="blue" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Total Techicians</h1>
              <span className="text-sm">4</span>
            </div>
          </div>
          {/* Total admins */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaUserShield size={24} color="red" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Admin(s)</h1>
              <span className="text-sm">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* table for user information */}
      <div className="bg-white rounded-lg my-5 shadow-sm border border-gray-200">
        <div className="px-6 py-2 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Manage system users and their permissions
            </p>
            <button
              command="show-modal"
              commandfor="add_user"
              className="bg-gradient-to-r from-yellow-500 to-[midnightblue] rounded-md font-sm px-4 py-2 text-white cursor-pointer transition duration-200 hover:font-semibold"
            >
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role & Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">JD</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        John Doe
                      </div>
                      <div className="text-sm text-gray-500">
                        john.doe@company.com
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Commercial</div>
                  <div className="text-sm text-gray-500">
                    Commercial Department
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  Jan 15, 2024
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                      Edit
                    </button>
                    <button
                      command="show-modal"
                      commandfor="dialog"
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">SJ</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Sarah Johnson
                      </div>
                      <div className="text-sm text-gray-500">
                        sarah.j@company.com
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Technical</div>
                  <div className="text-sm text-gray-500">
                    Technical Department
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  Feb 3, 2024
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                      Edit
                    </button>
                    <button
                      command="show-modal"
                      commandfor="dialog"
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">MB</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Mike Brown
                      </div>
                      <div className="text-sm text-gray-500">
                        mike.b@company.com
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Solutions</div>
                  <div className="text-sm text-gray-500">
                    Enterprise Solutions
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  Dec 20, 2023
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                      Edit
                    </button>
                    <button
                      command="show-modal"
                      commandfor="dialog"
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">EW</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Emma Wilson
                      </div>
                      <div className="text-sm text-gray-500">
                        emma.w@company.com
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Finance</div>
                  <div className="text-sm text-gray-500">
                    Finance Department
                  </div>
                </td>

                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  Mar 10, 2024
                </td>

                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                      Edit
                    </button>
                    <button
                      command="show-modal"
                      commandfor="dialog"
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">4</span> of{" "}
              <span className="font-medium">24</span> users
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {/* =============================== MODALS =========================== */}
      {/* modal for deleting users */}
      <el-dialog>
        <dialog
          id="dialog"
          aria-labelledby="dialog-title"
          class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
          <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div
            tabindex="0"
            class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
          >
            <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      data-slot="icon"
                      aria-hidden="true"
                      class="size-6 text-red-600"
                    >
                      <path
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      id="dialog-title"
                      class="text-base font-semibold text-gray-900"
                    >
                      Delete user
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delte this user? User data will
                        be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  command="close"
                  commandfor="dialog"
                  class="inline-flex w-full justify-center cursor-pointer rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  command="close"
                  commandfor="dialog"
                  class="mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>
      {/* modal for adding users by the admin*/}
      <el-dialog>
        <dialog
          id="add_user"
          aria-labelledby="dialog-title"
          class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
          <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div
            tabindex="0"
            class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
          >
            <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 mt-4 sm:px-10">
                    <div class="w-full">
                      <div class="flex flex-col items-center justify-center">
                        <img src={CompanyLogo} alt="MTL Logo" />
                        <h1 class="text-2xl font-md mt-2 text-gray-900">
                          Add User
                        </h1>
                      </div>
                      <div class="mt-8">
                        <form action="">
                          <div class="relative mt-6">
                            <input
                              type="text"
                              name="email"
                              id="f-name"
                              placeholder="First Name"
                              class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                              autocomplete="NA"
                            />
                            <label
                              for="f-name"
                              class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                            >
                              First Name
                            </label>
                          </div>
                          <div class="relative mt-6">
                            <input
                              type="text"
                              name="email"
                              id="surname"
                              placeholder="Surname"
                              class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                              autocomplete="NA"
                            />
                            <label
                              for="surname"
                              class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                            >
                              Surname
                            </label>
                          </div>
                          <div class="relative mt-6">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Email Address"
                              class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                              autocomplete="NA"
                            />
                            <label
                              for="email"
                              class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                            >
                              Email Address
                            </label>
                          </div>
                          <div class="relative mt-6">
                            <input
                              type="password"
                              name="password"
                              id="password"
                              placeholder="Password"
                              class="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                            />
                            <label
                              for="password"
                              class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                            >
                              Password
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  command="close"
                  commandfor="add_user"
                  class="inline-flex w-full justify-center cursor-pointer rounded-md bg-[midnightblue] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-800 sm:ml-3 sm:w-auto"
                >
                  Add
                </button>
                <button
                  type="button"
                  command="close"
                  commandfor="add_user"
                  class="mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>
    </div>
  );
};

export default Admin;
