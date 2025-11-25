import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendar,
  FaUser,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaUsers,
  FaFileAlt,
  FaArrowRight,
  FaRocket,
} from "react-icons/fa";

const SpecificProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [boqItems, setBoqItems] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showAllStages, setShowAllStages] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProject(result.data);
            setEditForm(result.data);
            setBoqItems(result.data.boq_items || []);
            setDocuments(result.data.documents || []);
          } else {
            setError(result.message || "Failed to load project");
          }
        } else if (response.status === 404) {
          setError("Project not found");
        } else {
          setError("Failed to load project");
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseInt(value)) : value,
    }));
  };

  // Save project updates
  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare update data with only allowed fields
      const updateData = {
        customer_name: editForm.customer_name || "",
        customer_organization: editForm.customer_organization || "",
        customer_email: editForm.customer_email || "",
        customer_phone: editForm.customer_phone || "",
        service_type: editForm.service_type || "",
        support_model: editForm.support_model || "",
        number_of_users: editForm.number_of_users || null,
        managed_service: editForm.managed_service || "",
      };

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh project data
        const refreshResponse = await fetch(`/api/projects/${id}`, {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setProject(refreshResult.data);
            setEditForm(refreshResult.data);
          }
        }
        setIsEditing(false);
        alert("Project updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditForm(project);
    setIsEditing(false);
  };

  // Advance project stage
  const advanceStage = async (newStage) => {
    try {
      const response = await fetch(`/api/projects/${id}/stage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          new_stage: newStage,
          remarks: `Stage advanced to ${newStage}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh project data
        const refreshResponse = await fetch(`/api/projects/${id}`, {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setProject(refreshResult.data);
            setEditForm(refreshResult.data);
          }
        }
        alert(
          `Project advanced to ${getStageDisplayName(newStage)} successfully!`
        );
      } else {
        throw new Error(result.message || "Failed to advance stage");
      }
    } catch (error) {
      console.error("Failed to advance stage:", error);
      alert("Failed to advance stage: " + error.message);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusStr = status?.toLowerCase();
    switch (statusStr) {
      case "completed":
      case "service_live":
        return "bg-green-100 text-green-800";
      case "in_progress":
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const statusStr = status?.toLowerCase();
    switch (statusStr) {
      case "completed":
      case "service_live":
        return <FaCheckCircle className="text-green-500" />;
      case "in_progress":
      case "in progress":
        return <FaClock className="text-blue-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "blocked":
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Calculate BOQ total
  const calculateBOQTotal = () => {
    return boqItems.reduce((total, item) => total + (item.total_price || 0), 0);
  };

  // Get stage display name
  const getStageDisplayName = (stage) => {
    const stageNames = {
      DRAFT: "Draft",
      QUOTATION: "Quotation",
      AWAITING_CUSTOMER_ACCEPTANCE: "Awaiting Customer",
      AWAITING_PAYMENT: "Awaiting Payment",
      SURVEY_SCHEDULED: "Survey Scheduled",
      READY_FOR_CONFIGURATION: "Ready for Config",
      READY_FOR_INSTALLATION: "Ready for Install",
      INSTALLATION_COMPLETE: "Install Complete",
      SERVICE_LIVE: "Service Live",
      DESIGN: "Design",
    };
    return stageNames[stage] || stage?.replace(/_/g, " ") || stage;
  };

  // Get next logical stages
  const getNextStages = () => {
    const currentStage = project?.current_stage;
    const stageFlow = {
      DRAFT: ["QUOTATION", "DESIGN"],
      QUOTATION: ["AWAITING_CUSTOMER_ACCEPTANCE", "DESIGN"],
      AWAITING_CUSTOMER_ACCEPTANCE: ["AWAITING_PAYMENT"],
      AWAITING_PAYMENT: ["SURVEY_SCHEDULED"],
      SURVEY_SCHEDULED: ["READY_FOR_CONFIGURATION"],
      READY_FOR_CONFIGURATION: ["READY_FOR_INSTALLATION"],
      READY_FOR_INSTALLATION: ["INSTALLATION_COMPLETE"],
      INSTALLATION_COMPLETE: ["SERVICE_LIVE"],
      DESIGN: ["READY_FOR_INSTALLATION"],
      SERVICE_LIVE: [],
    };

    return stageFlow[currentStage] || [];
  };

  // Get all stages for the dropdown
  const getAllStages = () => {
    return [
      "DRAFT",
      "QUOTATION",
      "DESIGN",
      "AWAITING_CUSTOMER_ACCEPTANCE",
      "AWAITING_PAYMENT",
      "SURVEY_SCHEDULED",
      "READY_FOR_CONFIGURATION",
      "READY_FOR_INSTALLATION",
      "INSTALLATION_COMPLETE",
      "SERVICE_LIVE",
    ].filter((stage) => stage !== project?.current_stage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/home/projects")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested project could not be found.
          </p>
          <button
            onClick={() => navigate("/home/projects")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const nextStages = getNextStages();
  const allStages = getAllStages();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>MTL SSE - {project.project_code}</title>
        <meta
          name="description"
          content={`Details for project ${project.project_code}`}
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center xs:space-x-1 sm:space-x-2 md:space-x-4">
              <button
                onClick={() => navigate("/home/projects")}
                className="flex items-center justify-between text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <div className="hidden md:block">Back to Projects</div>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 hidden md:block">
                  {project.project_code}
                </h1>
                <p className="text-gray-600">{project.customer_name}</p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  project.current_stage
                )}`}
              >
                {getStatusIcon(project.current_stage)}
                <span className="ml-1">
                  {getStageDisplayName(project.current_stage)}
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  <div>
                    Edit <span className="hidden md:inline-flex">Project</span>
                  </div>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center bg-green-600 text-white px-1 py-1 md:px-4 md:py-2 cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave size={24} className="mr-2" />
                    {saving ? (
                      "Saving..."
                    ) : (
                      <div>
                        {/* <span className="md:hidden">
                          <FaSave className="mr-2" />
                        </span> */}
                        <span className="hidden md:inline-flex">
                          Save changes
                        </span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center bg-gray-600 text-white px-1 py-1 md:px-4 md:py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    <FaTimes size={24} className="mr-2" />
                    <div>
                      <span className="hidden md:inline-flex">Cancel</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="customer_name"
                        value={editForm.customer_name || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{project.customer_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Organization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="customer_organization"
                        value={editForm.customer_organization || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.customer_organization || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="customer_email"
                        value={editForm.customer_email || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.customer_email || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="customer_phone"
                        value={editForm.customer_phone || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.customer_phone || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Service Type
                    </label>
                    {isEditing ? (
                      <select
                        name="service_type"
                        value={editForm.service_type || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Service Type</option>
                        <option value="VPN">VPN</option>
                        <option value="Internet">Internet</option>
                        <option value="SIP">SIP</option>
                        <option value="Cloud PBX">Cloud PBX</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{project.service_type}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Support Model
                    </label>
                    {isEditing ? (
                      <select
                        name="support_model"
                        value={editForm.support_model || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Support Model</option>
                        <option value="Internal">Internal</option>
                        <option value="Outsourced">Outsourced</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {project.support_model || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Users
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="number_of_users"
                        value={editForm.number_of_users || ""}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.number_of_users || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Managed Service
                    </label>
                    {isEditing ? (
                      <select
                        name="managed_service"
                        value={editForm.managed_service || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Service Type</option>
                        <option value="Managed">Managed</option>
                        <option value="Unmanaged">Unmanaged</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {project.managed_service || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BOQ Items Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bill of Quantities
                </h2>
                <span className="text-sm font-medium text-gray-700">
                  Total: {formatCurrency(calculateBOQTotal())}
                </span>
              </div>
              <div className="p-6">
                {boqItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Type</th>
                          <th className="text-left py-2 font-medium">
                            Description
                          </th>
                          <th className="text-left py-2 font-medium">Model</th>
                          <th className="text-right py-2 font-medium">Qty</th>
                          <th className="text-right py-2 font-medium">
                            Unit Price
                          </th>
                          <th className="text-right py-2 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boqItems.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">{item.item_type}</td>
                            <td className="py-3">{item.description}</td>
                            <td className="py-3">{item.model || "-"}</td>
                            <td className="py-3 text-right">{item.quantity}</td>
                            <td className="py-3 text-right">
                              {formatCurrency(item.unit_price)}
                            </td>
                            <td className="py-3 text-right font-medium">
                              {formatCurrency(item.total_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No BOQ items added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Stage Advancement Card - COMPACT DESIGN */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaRocket className="mr-2 text-blue-600" />
                  Advance Stage
                </h2>
              </div>
              <div className="p-6">
                {/* Quick Actions - Primary Buttons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {nextStages.slice(0, 4).map((stage) => (
                      <button
                        key={stage}
                        onClick={() => advanceStage(stage)}
                        className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                      >
                        {getStageDisplayName(stage)}
                      </button>
                    ))}
                    {nextStages.length === 0 && (
                      <div className="col-span-2 text-center py-2 text-gray-500 text-sm">
                        No next stages available
                      </div>
                    )}
                  </div>
                </div>

                {/* All Stages Dropdown */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      All Stages
                    </h3>
                    <button
                      onClick={() => setShowAllStages(!showAllStages)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {showAllStages ? "Hide" : "Show All"}
                    </button>
                  </div>

                  {showAllStages && (
                    <div className="grid grid-cols-2 gap-2">
                      {allStages.map((stage) => (
                        <button
                          key={stage}
                          onClick={() => advanceStage(stage)}
                          className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors border border-gray-300"
                        >
                          {getStageDisplayName(stage)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Stage Indicator */}
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      Current Stage:
                    </span>
                    <span className="text-sm font-semibold text-blue-900">
                      {getStageDisplayName(project.current_stage)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Timeline Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {project.stages &&
                    project.stages.map((stage, index) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            stage.status === "COMPLETED"
                              ? "bg-green-500"
                              : stage.status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : stage.status === "BLOCKED"
                              ? "bg-red-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">
                              {getStageDisplayName(stage.stage)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                stage.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : stage.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-800"
                                  : stage.status === "BLOCKED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {stage.status?.replace("_", " ").toLowerCase()}
                            </span>
                          </div>
                          {stage.assigned_to && (
                            <p className="text-xs text-gray-600">
                              {stage.assigned_to}
                            </p>
                          )}
                          {stage.entered_date && (
                            <p className="text-xs text-gray-500">
                              {new Date(
                                stage.entered_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Project Metadata Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Details
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {project.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created By
                    </label>
                    <p className="text-gray-900">{project.created_by}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <p className="text-gray-900">
                      {project.created_at
                        ? new Date(project.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {project.updated_at
                        ? new Date(project.updated_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaFileAlt className="mr-2" />
                  Documents
                </h2>
              </div>
              <div className="p-6">
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {doc.document_type}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificProject;
