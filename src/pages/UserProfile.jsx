import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserPic from "../assets/user.webp";
import { useAuth } from "../hooks/UseAuth";
import { Helmet } from "react-helmet";

const UserProfile = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/auth/user-details", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password.trim()) {
      errors.current_password = "Current password is required";
    }

    if (!new_password.trim()) {
      errors.new_password = "New password is required";
    } else if (new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(new_password)) {
      errors.new_password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(new_password)) {
      errors.new_password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(new_password)) {
      errors.new_password = "Password must contain at least one number";
    } else if (!/(?=.*[!@#$%^&*()\-_=+[\]{}|;:,.<>?/~`])/.test(new_password)) {
      errors.new_password =
        "Password must contain at least one special character (!@#$%^&*()-_=+[]{}|;:,.<>?/~`)";
    }

    if (!confirm_password.trim()) {
      errors.confirm_password = "Please confirm your password";
    } else if (new_password !== confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setPasswordErrors({});
        setIsChangingPassword(false);
      } else {
        if (data.data) {
          setPasswordErrors(data.data);
        }
        setPasswordMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!user) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  const displayUser = userDetails || user;

  return (
    <div>
      <Helmet>
        <title>MTL SSE - User Profile</title>
        <meta name="description" content="User Profile Page" />
        <meta property="og:title" content="MTL SSE | User Profile" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xl text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                    <img
                      src={UserPic}
                      alt="user profile"
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {displayUser.username ||
                      `${displayUser.f_name} ${displayUser.l_name}`}
                  </h2>
                  <p className="text-blue-600 font-medium mt-1 capitalize">
                    {displayUser.department}
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
                    <span className="text-gray-600">Role</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {displayUser.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-900">
                      {displayUser.date_joined}
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
                    <p className="font-medium text-gray-900 capitalize">
                      {displayUser.department}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Role</span>
                    <p className="font-medium text-gray-900 capitalize">
                      {displayUser.role}
                    </p>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      {displayUser.f_name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      {displayUser.l_name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      {displayUser.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                      {displayUser.username ||
                        `${displayUser.f_name} ${displayUser.l_name}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Security Settings
                  </h3>
                </div>

                {!isChangingPassword ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-900">Password</h4>
                        {/* <p className="text-sm text-gray-600">
                          Last changed recently
                        </p> */}
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="text-blue-600  cursor-pointer hover:text-blue-700 text-sm font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Change Password
                    </h4>

                    {passwordMessage.text && (
                      <div
                        className={`mb-4 p-3 rounded-md ${
                          passwordMessage.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {passwordMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleSubmitPasswordChange}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              name="current_password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                passwordErrors.current_password
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("current")
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500  cursor-pointer hover:text-gray-700"
                            >
                              {showPassword.current ? "hide" : "show"}
                            </button>
                          </div>
                          {passwordErrors.current_password && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.current_password}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.new ? "text" : "password"}
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                passwordErrors.new_password
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("new")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500  cursor-pointer hover:text-gray-700"
                            >
                              {showPassword.new ? "hide" : "show"}
                            </button>
                          </div>
                          {passwordErrors.new_password && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.new_password}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-600">
                            Password must contain:
                            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
                              <li
                                className={
                                  passwordData.new_password.length >= 8
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                At least 8 characters
                              </li>
                              <li
                                className={
                                  /(?=.*[a-z])/.test(passwordData.new_password)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                One lowercase letter
                              </li>
                              <li
                                className={
                                  /(?=.*[A-Z])/.test(passwordData.new_password)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                One uppercase letter
                              </li>
                              <li
                                className={
                                  /(?=.*\d)/.test(passwordData.new_password)
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                One number
                              </li>
                              <li
                                className={
                                  /(?=.*[!@#$%^&*()\-_=+[\]{}|;:,.<>?/~`])/.test(
                                    passwordData.new_password
                                  )
                                    ? "text-green-600"
                                    : ""
                                }
                              >
                                One special character
                              </li>
                            </ul>
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              name="confirm_password"
                              value={passwordData.confirm_password}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                passwordErrors.confirm_password
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500  cursor-pointer hover:text-gray-700"
                            >
                              {showPassword.confirm ? "hide" : "show"}
                            </button>
                          </div>
                          {passwordErrors.confirm_password && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.confirm_password}
                            </p>
                          )}
                          {passwordData.new_password &&
                            passwordData.confirm_password &&
                            passwordData.new_password ===
                              passwordData.confirm_password && (
                              <p className="mt-1 text-sm text-green-600">
                                ✓ Passwords match
                              </p>
                            )}
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md  cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Change Password
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({
                                current_password: "",
                                new_password: "",
                                confirm_password: "",
                              });
                              setPasswordErrors({});
                              setPasswordMessage({ type: "", text: "" });
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md  cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
