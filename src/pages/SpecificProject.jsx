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
  FaTag,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCog,
  FaUsers,
  FaFileAlt,
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
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save project updates
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm),
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
        // Show success message
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
        alert(`Project advanced to ${newStage} successfully!`);
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
    switch (status?.toLowerCase()) {
      case "completed":
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
    switch (status?.toLowerCase()) {
      case "completed":
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>MTL SSE</title>
        <meta
          name="description"
          content={`Details for project ${project.project_code}`}
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => navigate("/home/projects")}
                className="flex items-center text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Projects
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
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
                <span className="ml-1 capitalize">
                  {project.current_stage?.replace("_", " ")}
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Project
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
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
                  <div className="flex items-start">
                    <FaUser className="text-gray-400 mt-1 mr-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  </div>

                  <div className="flex items-start">
                    <FaBuilding className="text-gray-400 mt-1 mr-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  </div>

                  <div className="flex items-start">
                    <FaEnvelope className="text-gray-400 mt-1 mr-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  </div>

                  <div className="flex items-start">
                    <FaPhone className="text-gray-400 mt-1 mr-3" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    {isEditing ? (
                      <select
                        name="service_type"
                        value={editForm.service_type || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="VPN">VPN</option>
                        <option value="Internet">Internet</option>
                        <option value="SIP">SIP</option>
                        <option value="Cloud PBX">Cloud PBX</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{project.service_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Model
                    </label>
                    {isEditing ? (
                      <select
                        name="support_model"
                        value={editForm.support_model || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden></option>
                        <option value="Internal">Internal</option>
                        <option value="Outsourced">Outsourced</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {project.support_model || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Users
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="number_of_users"
                        value={editForm.number_of_users || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.number_of_users || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Managed Service
                    </label>
                    {isEditing ? (
                      <select
                        name="managed_service"
                        value={editForm.managed_service || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>
                          Select Service Type
                        </option>
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
                          <th className="text-left py-2 font-medium">
                            Item Type
                          </th>
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
            {/* Project Timeline Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {project.stages &&
                    project.stages.map((stage, index) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 ${
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
                            <span className="font-medium text-gray-900 capitalize">
                              {stage.stage?.replace("_", " ")}
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
                            <p className="text-sm text-gray-600">
                              Assigned to: {stage.assigned_to}
                            </p>
                          )}
                          {stage.entered_date && (
                            <p className="text-xs text-gray-500">
                              Started:{" "}
                              {new Date(
                                stage.entered_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                          {stage.completed_date && (
                            <p className="text-xs text-gray-500">
                              Completed:{" "}
                              {new Date(
                                stage.completed_date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Stage Advancement Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => advanceStage("QUOTATION")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm"
                  >
                    Advance to Quotation
                  </button>
                  <button
                    onClick={() => advanceStage("DESIGN")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm"
                  >
                    Advance to Design
                  </button>
                  <button
                    onClick={() => advanceStage("INSTALLATION")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition-colors text-sm"
                  >
                    Advance to Installation
                  </button>
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
