import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaUserShield,
  FaMoneyBillWave,
  FaCog,
  FaTools,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import CompanyLogo from "../assets/mtl-logo-75.png";
import { useAuth } from "../hooks/UseAuth";

const Admin = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    department: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch users
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/admin/user-management", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": user?.role || "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Raw response data:", data);
          setUserDetails(data);
        } else {
          console.error(
            "Response not OK:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user, success]);

  // Add User Functionality
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.f_name.trim()) newErrors.f_name = "First name is required";
    if (!formData.l_name.trim()) newErrors.l_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.role) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/user-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setShowAddModal(false);
        setFormData({
          f_name: "",
          l_name: "",
          email: "",
          department: "",
          role: "",
        });

        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        if (result.data && typeof result.data === "object") {
          setErrors(result.data);
        } else {
          setErrors({ general: result.message || "Failed to add user" });
        }
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Delete User Functionality
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/user-management/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setShowDeleteModal(false);
        setUserToDelete(null);

        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.message || "Failed to delete user");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setUserToDelete(null);
    setFormData({
      f_name: "",
      l_name: "",
      email: "",
      department: "",
      role: "",
    });
    setErrors({});
  };

  const totalUsers = userDetails.length;
  const salesExecutives = userDetails.filter(
    (user) => user.role === "Sales Executive"
  ).length;
  const technicalStaff = userDetails.filter(
    (user) =>
      user.role === "Wireless Engineer" ||
      user.role === "IP Broadband Engineer" ||
      user.role === "Solutions"
  ).length;
  const financeTeam = userDetails.filter(
    (user) => user.role === "Accountant"
  ).length;
  const admins = userDetails.filter(
    (user) => user.role === "Admin" || user.role === "SuperAdmin"
  ).length;

  return (
    <div>
      <Helmet>
        <title>MTL SSE</title>
        <meta
          name="description"
          content="Admin Panel - Management of application settings and users."
        />
        <meta property="og:title" content="Admin Panel" />
      </Helmet>

      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Operation completed successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* admin main page content */}
      <div className="max-w-full overflow-hidden">
        {/* top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 items-center justify-center">
          {/* Total users */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaUser size={24} color="blue" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Total Users</h1>
              <span className="text-sm">{totalUsers}</span>
            </div>
          </div>
          {/* Total commercial members */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaMoneyBillWave size={24} color="green" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Sales Executives</h1>
              <span className="text-sm">{salesExecutives}</span>
            </div>
          </div>
          {/* Total SSE members */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaCog size={24} color="purple" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Technical Staff</h1>
              <span className="text-sm">{technicalStaff}</span>
            </div>
          </div>
          {/* Total technicians (specifically those from NOC) */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaTools size={24} color="blue" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Finance Team</h1>
              <span className="text-sm">{financeTeam}</span>
            </div>
          </div>
          {/* Total admins */}
          <div className="bg-white py-3 px-4 rounded-md cursor-pointer shadow-lg transition duration-300 hover:shadow-none hover:scale-102">
            <FaUserShield size={24} color="red" />
            <div className="flex mt-2">
              <h1 className="mr-4 text-sm">Admin(s)</h1>
              <span className="text-sm">{admins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* table for user information */}
      <div className="bg-white rounded-lg my-3 shadow-sm border border-gray-200">
        <div className="px-6 py-2 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Manage system users and their permissions
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-yellow-500 to-[midnightblue] rounded-md font-sm px-4 py-2 text-white cursor-pointer transition duration-200 hover:font-semibold"
            >
              Add
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
              {userDetails.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.user_label}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.f_name} {user.l_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                    <div className="text-sm text-gray-500">
                      {user.department}
                    </div>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {user.date_created}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{userDetails.length}</span> of{" "}
              <span className="font-medium">{userDetails.length}</span> users
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

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500/75 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Delete User
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {userToDelete?.f_name}{" "}
                  {userToDelete?.l_name}? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={closeModals}
                  className="px-4 py-2 bg-white text-gray-800 text-base font-medium rounded-md border border-gray-300 w-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500/75 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex flex-col items-center justify-center">
                <img src={CompanyLogo} alt="MTL Logo" />
                <h1 className="text-2xl font-md mt-1 text-gray-900">
                  Add User
                </h1>
              </div>
              <div className="mt-6">
                <form onSubmit={handleAddUser}>
                  <div className="relative mt-4">
                    <input
                      type="text"
                      name="f_name"
                      id="f-name"
                      placeholder="Firstname"
                      className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                        errors.f_name
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                      autoComplete="NA"
                      value={formData.f_name}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="f-name"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      firstname
                    </label>
                    {errors.f_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.f_name}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-4">
                    <input
                      type="text"
                      name="l_name"
                      id="l-name"
                      placeholder="Last Name"
                      className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                        errors.l_name
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                      autoComplete="NA"
                      value={formData.l_name}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="l-name"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      surname
                    </label>
                    {errors.l_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.l_name}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-4">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email Address"
                      className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                      autoComplete="NA"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="email"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      email address
                    </label>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-6">
                    <select
                      name="department"
                      id="department"
                      className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                      autoComplete="NA"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled hidden></option>
                      <option value="Commercial">Commercial</option>
                      <option value="Finance">Finance</option>
                      <option value="Technical">Technical</option>
                    </select>
                    <label
                      htmlFor="department"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      select department
                    </label>
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-6">
                    <select
                      name="role"
                      id="role"
                      className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                        errors.role
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-500"
                      }`}
                      autoComplete="NA"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled hidden></option>
                      <option value="Wireless Engineer">
                        Wireless Engineer
                      </option>
                      <option value="IP Broadband Engineer">
                        IP Broadband Engineer
                      </option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Solutions">SSE</option>
                    </select>
                    <label
                      htmlFor="role"
                      className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                    >
                      select role
                    </label>
                    {errors.role && (
                      <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                    )}
                  </div>

                  {errors.general && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm text-center">
                        {errors.general}
                      </p>
                    </div>
                  )}

                  <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full justify-center cursor-pointer rounded-md bg-[midnightblue] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-800 sm:ml-3 sm:w-auto disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModals}
                      className="mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
