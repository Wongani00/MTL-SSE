import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useAuth } from "../hooks/UseAuth";
import CompanyLogo from "../assets/mtl-logo-75.png";

const Projects = () => {
  const user = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Customer Information
    project_code: "",
    customer_organization: "",
    project_information: "",

    // Service Requested
    service_type: "",
    vpn_aggregated_sites: "",
    number_of_users: 0,

    // IT Personnel
    support_model: "",

    // Infrastructure
    router_firewall_present: "",
    domain_hosted_at: "",
    mail_server_at_client_site: "",
    mail_server_version: "",
    email_system_managed_by: "",
    dns_server_present: "",
    dns_managed_by: "",
    lan_present: "",
    equipment_cabinet_present: "",
    space_available_in_cabinet: "",

    // Service Classification
    managed_service: "",
  });

  // fetching projects data
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/projects", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.success) {
          setProjects(result.data);
        } else {
          alert(result.message || "Failed to fetch projects");
        }
      } catch (error) {
        alert("Failed to load data, please try again. " + error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjectData();
    }
  }, [user, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_users" ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.project_code.trim())
      newErrors.project_code = "Project code is required";
    if (!formData.customer_organization.trim())
      newErrors.customer_organization = "Customer organization is required";
    if (!formData.service_type)
      newErrors.service_type = "Service type is required";
    if (!formData.support_model)
      newErrors.support_model = "Support model is required";
    if (formData.number_of_users < 0)
      newErrors.number_of_users = "Number of users must be 0 or greater";
    if (!formData.managed_service)
      newErrors.managed_service = "Managed service is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/projects", {
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
          project_code: "",
          customer_organization: "",
          project_information: "",
          service_type: "",
          vpn_aggregated_sites: "",
          number_of_users: 0,
          support_model: "",
          router_firewall_present: "",
          domain_hosted_at: "",
          mail_server_at_client_site: "",
          mail_server_version: "",
          email_system_managed_by: "",
          dns_server_present: "",
          dns_managed_by: "",
          lan_present: "",
          equipment_cabinet_present: "",
          space_available_in_cabinet: "",
          managed_service: "",
        });

        // Hide success after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        if (result.data && typeof result.data === "object") {
          setErrors(result.data);
        } else {
          setErrors({ general: result.message || "Failed to create project" });
        }
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setFormData({
      project_code: "",
      customer_name: "",
      customer_organization: "",
      project_information: "",
      service_type: "",
      vpn_aggregated_sites: "",
      number_of_users: 0,
      support_model: "",
      router_firewall_present: "",
      domain_hosted_at: "",
      mail_server_at_client_site: "",
      mail_server_version: "",
      email_system_managed_by: "",
      dns_server_present: "",
      dns_managed_by: "",
      lan_present: "",
      equipment_cabinet_present: "",
      space_available_in_cabinet: "",
      managed_service: "",
    });
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>MTL SSE</title>
        <meta
          name="description"
          content="Projects - Overview of all projects and their statuses."
        />
        <meta property="og:title" content="Projects" />
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
                Project created successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* table for project information */}
      <div className="bg-white rounded-lg my-3 shadow-sm border border-gray-200">
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing all available Projects
            </p>
            {user && user.hasRole("Sales Executive") && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-[midnightblue] rounded-md font-sm px-4 py-2 text-white cursor-pointer transition duration-200 hover:font-semibold"
              >
                Create
              </button>
            )}
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
                  Project Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Organization
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Users
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Support Model
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Managed Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Stage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated At
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
              {projects.map((project, index) => (
                <tr
                  key={project.id || index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.project_code}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.project_information}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.customer_organization || "-"}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.service_type === "VPN"
                          ? "bg-purple-100 text-purple-800"
                          : project.service_type === "Internet"
                          ? "bg-blue-100 text-blue-800"
                          : project.service_type === "SIP"
                          ? "bg-green-100 text-green-800"
                          : project.service_type === "Cloud PBX"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.service_type}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.number_of_users || 0}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.support_model === "Internal"
                          ? "bg-green-100 text-green-800"
                          : project.support_model === "Outsourced"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.support_model || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.managed_service === "Managed"
                          ? "bg-blue-100 text-blue-800"
                          : project.managed_service === "Unmanaged"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.managed_service || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.current_stage === "DRAFT"
                          ? "bg-gray-100 text-gray-800"
                          : project.current_stage === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : project.current_stage === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : project.current_stage === "ON_HOLD"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.current_stage?.replace("_", " ") || "DRAFT"}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.created_by || "-"}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.updated_at || "-"}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors"
                        title="Edit Project"
                      >
                        Edit
                      </button>
                      <NavLink to={`${project.id}`}>
                        <button
                          className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors"
                          title="View Project Details"
                        >
                          <FaEye size={18} />
                        </button>
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal for adding projects */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500/75 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex flex-col items-center justify-center">
                <img src={CompanyLogo} alt="MTL Logo" />
                <h1 className="text-2xl font-md mt-1 text-gray-900">
                  Create Project
                </h1>
              </div>
              <div className="mt-6">
                <form onSubmit={handleAddProject}>
                  {/* Customer Information Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                      Customer Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="project_code"
                          id="project_code"
                          placeholder="Project Code"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.project_code
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.project_code}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="project_code"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Project Code
                        </label>
                        {errors.project_code && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.project_code}
                          </p>
                        )}
                      </div>

                      {/* <div className="relative">
                        <input
                          type="text"
                          name="customer_name"
                          id="customer_name"
                          placeholder="Customer Name"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.customer_name
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.customer_name}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="customer_name"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Customer Name
                        </label>
                        {errors.customer_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.customer_name}
                          </p>
                        )}
                      </div> */}

                      <div className="relative">
                        <input
                          type="text"
                          name="customer_organization"
                          id="customer_organization"
                          placeholder="Customer Organization"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.customer_organization
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.customer_organization}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="customer_organization"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Customer Organization
                        </label>
                        {errors.customer_organization && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.customer_organization}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative mt-6">
                      <input
                        type="text"
                        name="project_information"
                        id="project_information"
                        placeholder="Project Information"
                        className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                          errors.project_information
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                        }`}
                        autoComplete="off"
                        value={formData.project_information}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="project_information"
                        className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                      >
                        Project Information
                      </label>
                      {errors.project_information && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.project_information}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service Requested Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                      Service Requested
                    </h2>

                    <div className="relative mb-4">
                      <select
                        name="service_type"
                        id="service_type"
                        className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                          errors.service_type
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                        }`}
                        autoComplete="off"
                        required
                        value={formData.service_type}
                        onChange={handleInputChange}
                      >
                        <option value="" hidden></option>
                        <option value="VPN">VPN</option>
                        <option value="Internet">Internet</option>
                        <option value="SIP">SIP</option>
                        <option value="Cloud PBX">Cloud PBX</option>
                      </select>
                      <label
                        htmlFor="service_type"
                        className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                      >
                        Service Type
                      </label>
                      {errors.service_type && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.service_type}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="vpn_aggregated_sites"
                          id="vpn_aggregated_sites"
                          placeholder="VPN Aggregated Sites/Capacity"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.vpn_aggregated_sites
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.vpn_aggregated_sites}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="vpn_aggregated_sites"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          VPN Aggregated Sites/Capacity
                        </label>
                        {errors.vpn_aggregated_sites && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.vpn_aggregated_sites}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="number_of_users"
                          min={0}
                          id="number_of_users"
                          placeholder="Number of Users"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.number_of_users
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.number_of_users}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="number_of_users"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Number of Users
                        </label>
                        {errors.number_of_users && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.number_of_users}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IT Personnel Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                      IT Personnel
                    </h2>

                    <div className="relative">
                      <select
                        name="support_model"
                        id="support_model"
                        className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                          errors.support_model
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                        }`}
                        autoComplete="off"
                        required
                        value={formData.support_model}
                        onChange={handleInputChange}
                      >
                        <option value="" hidden></option>
                        <option value="Internal">Internal</option>
                        <option value="Outsourced">Outsourced</option>
                      </select>
                      <label
                        htmlFor="support_model"
                        className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                      >
                        Support Model
                      </label>
                      {errors.support_model && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.support_model}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Infrastructure Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                      Infrastructure
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <select
                          name="router_firewall_present"
                          id="router_firewall_present"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.router_firewall_present
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.router_firewall_present}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="router_firewall_present"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Router/Firewall Present
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="domain_hosted_at"
                          id="domain_hosted_at"
                          placeholder="Domain Hosted At"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.domain_hosted_at
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.domain_hosted_at}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="domain_hosted_at"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Domain Hosted At
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="mail_server_at_client_site"
                          id="mail_server_at_client_site"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.mail_server_at_client_site
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.mail_server_at_client_site}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="mail_server_at_client_site"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Mail Server at Client Site
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="mail_server_version"
                          id="mail_server_version"
                          placeholder="Mail Server Version"
                          className={`peer mt-1 w-full border-b-2 px-0 py-1 placeholder:text-transparent focus:outline-none ${
                            errors.mail_server_version
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.mail_server_version}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="mail_server_version"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Mail Server Version
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="email_system_managed_by"
                          id="email_system_managed_by"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.email_system_managed_by
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.email_system_managed_by}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Internal IT">Internal IT</option>
                          <option value="ISP">ISP</option>
                          <option value="Third Party">Third Party</option>
                        </select>
                        <label
                          htmlFor="email_system_managed_by"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Email System Managed By
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="dns_server_present"
                          id="dns_server_present"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.dns_server_present
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.dns_server_present}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="dns_server_present"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          DNS Server Present
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="dns_managed_by"
                          id="dns_managed_by"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.dns_managed_by
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.dns_managed_by}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Internal IT">Internal IT</option>
                          <option value="ISP">ISP</option>
                          <option value="Third Party">Third Party</option>
                        </select>
                        <label
                          htmlFor="dns_managed_by"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          DNS Managed By
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="lan_present"
                          id="lan_present"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.lan_present
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.lan_present}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="lan_present"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          LAN Present
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="equipment_cabinet_present"
                          id="equipment_cabinet_present"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.equipment_cabinet_present
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.equipment_cabinet_present}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="equipment_cabinet_present"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Equipment Cabinet Present
                        </label>
                      </div>

                      <div className="relative">
                        <select
                          name="space_available_in_cabinet"
                          id="space_available_in_cabinet"
                          className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                            errors.space_available_in_cabinet
                              ? "border-red-500"
                              : "border-gray-300 focus:border-gray-500"
                          }`}
                          autoComplete="off"
                          value={formData.space_available_in_cabinet}
                          onChange={handleInputChange}
                        >
                          <option value="" hidden></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <label
                          htmlFor="space_available_in_cabinet"
                          className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                        >
                          Space Available in Cabinet
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Service Classification Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                      Service Classification
                    </h2>

                    <div className="relative">
                      <select
                        name="managed_service"
                        id="managed_service"
                        className={`peer mt-1 w-full border-b-2 bg-transparent px-0 py-1 focus:outline-none ${
                          errors.managed_service
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                        }`}
                        autoComplete="off"
                        required
                        value={formData.managed_service}
                        onChange={handleInputChange}
                      >
                        <option value="" hidden></option>
                        <option value="Managed">Managed</option>
                        <option value="Unmanaged">Unmanaged</option>
                      </select>
                      <label
                        htmlFor="managed_service"
                        className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                      >
                        Managed Service
                      </label>
                      {errors.managed_service && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.managed_service}
                        </p>
                      )}
                    </div>
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
                      {loading ? "Creating..." : "Create Project"}
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

export default Projects;
