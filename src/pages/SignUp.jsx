import React, { useState } from "react";
import CompanyLogo from "../assets/mtl-logo-75.png";
import { NavLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    department: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.f_name.trim()) {
      newErrors.f_name = "First name is required";
    } else if (formData.f_name.length < 2) {
      newErrors.f_name = "First name must be at least 2 characters";
    }

    if (!formData.l_name.trim()) {
      newErrors.l_name = "Last name is required";
    } else if (formData.l_name.length < 2) {
      newErrors.l_name = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle server-side validation errors
        if (result.data && typeof result.data === "object") {
          setErrors(result.data);
        } else {
          setErrors({ general: result.message || "Registration failed" });
        }
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="flex flex-col items-center justify-center">
              <img src={CompanyLogo} alt="MTL Logo" />
              <h1 className="text-2xl font-md mt-2 text-gray-900">Success!</h1>
            </div>
            <div className="mt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Registration successful!</p>
              <p className="text-gray-500 text-sm">
                Redirecting to login page...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <img src={CompanyLogo} alt="MTL Logo" />
            <h1 className="text-2xl font-md mt-2 text-gray-900">Sign Up</h1>
          </div>
          <div className="mt-6">
            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="relative mt-4">
                <input
                  type="text"
                  name="f_name"
                  id="f-name"
                  placeholder="First Name"
                  className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                    errors.f_name
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                  autoComplete="given-name"
                  value={formData.f_name}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="f-name"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  First Name
                </label>
                {errors.f_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.f_name}</p>
                )}
              </div>

              {/* Last Name */}
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
                  autoComplete="family-name"
                  value={formData.l_name}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="l-name"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Last Name
                </label>
                {errors.l_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.l_name}</p>
                )}
              </div>

              {/* Email */}
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Department Dropdown */}
              <div className="relative mt-4">
                <select
                  name="department"
                  id="department"
                  className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                    errors.department
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                  autoComplete="organization"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={loading}
                  required
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
                  Select Department
                </label>
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Role Dropdown */}
              <div className="relative mt-4">
                <select
                  name="role"
                  id="role"
                  className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                    errors.role
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                  autoComplete="organization-title"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="" disabled hidden></option>
                  <option value="Wireless Engineer">Wireless Engineer</option>
                  <option value="IP Broadband Engineer">
                    IP Broadband Engineer
                  </option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Accountant">Accountant</option>
                </select>
                <label
                  htmlFor="role"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Select Role
                </label>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative mt-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="password"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm text-center">
                    {errors.general}
                  </p>
                </div>
              )}

              <div className="my-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-[midnightblue] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none cursor-pointer duration-200 transition hover:font-semibold hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Already have an account?
                <NavLink
                  to="/login"
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  {" "}
                  login
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
