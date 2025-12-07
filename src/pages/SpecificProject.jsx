import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
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
  FaBug,
  FaServer,
  FaNetworkWired,
  FaGlobe,
  FaMailBulk,
  FaHdd,
  FaBox,
  FaLayerGroup,
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
  const [tasks, setTasks] = useState([]);
  const [advancingStage, setAdvancingStage] = useState(false);
  const [surveyExists, setSurveyExists] = useState(false);
  const [survey, setSurvey] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  // Define the actual ProjectStatus enum values from your models.py
  const PROJECT_STATUS = {
    DRAFT: "Draft",
    UNDER_DESIGN: "Under Design",
    AWAITING_COSTING: "Awaiting Costing",
    AWAITING_CUSTOMER_ACCEPTANCE: "Awaiting Customer Acceptance",
    AWAITING_PAYMENT: "Awaiting Payment",
    SURVEY_SCHEDULED: "Survey Scheduled",
    SURVEY_COMPLETE: "Survey Complete",
    READY_FOR_CONFIGURATION: "Ready for Configuration",
    READY_FOR_INSTALLATION: "Ready for Installation",
    INSTALLATION_COMPLETE: "Installation Complete",
    SERVICE_LIVE: "Service Live",
  };

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

            // fetching survey data
            try {
              const surveyResponse = await fetch(`/api/projects/${id}/survey`, {
                credentials: "include",
              });

              if (surveyResponse.ok) {
                const surveyResult = await surveyResponse.json();
                if (surveyResult.success) {
                  setSurvey(surveyResult.data);
                  setSurveyExists(true);
                } else {
                  setSurveyExists(false);
                }
              } else {
                setSurveyExists(false);
              }
            } catch (surveyError) {
              console.error("Failed to fetch survey:", surveyError);
              setSurveyExists(false);
            }
          } else {
            setError(result.message || "Failed to load project");
          }
        } else if (response.status === 404) {
          setError("Project not found");
        } else if (response.status === 403) {
          setError("Access denied");
        } else {
          setError("Failed to load project - Server error");
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

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/workflow/tasks", {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const projectTasks = result.data.filter(
              (task) => task.project_id === id
            );
            setTasks(projectTasks);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (project) {
      fetchTasks();
    }
  }, [id, project?.current_stage]);

  console.log("tasks : ", tasks);

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

      const updateData = {
        // Customer Information
        customer_name: editForm.customer_name || "",
        customer_organization: editForm.customer_organization || "",
        project_information: editForm.project_information || "",

        // Service Requested
        service_type: editForm.service_type || "",
        vpn_aggregated_sites: editForm.vpn_aggregated_sites || "",
        number_of_users: editForm.number_of_users || null,

        // IT Personnel
        support_model: editForm.support_model || "",

        // Infrastructure
        router_firewall_present: editForm.router_firewall_present || "",
        domain_hosted_at: editForm.domain_hosted_at || "",
        mail_server_at_client_site: editForm.mail_server_at_client_site || "",
        mail_server_version: editForm.mail_server_version || "",
        email_system_managed_by: editForm.email_system_managed_by || "",
        dns_server_present: editForm.dns_server_present || "",
        dns_managed_by: editForm.dns_managed_by || "",
        lan_present: editForm.lan_present || "",
        equipment_cabinet_present: editForm.equipment_cabinet_present || "",
        space_available_in_cabinet: editForm.space_available_in_cabinet || "",

        // Service Classification
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
        await fetchProjectData();
        setIsEditing(false);
        alert("Project updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update project");
      }
    } catch (error) {
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

  // Refresh project data
  const fetchProjectData = async () => {
    try {
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
        }
      }
    } catch (error) {
      alert.error("Failed to refresh project:", error);
    }
  };

  // Get the enum key from display value
  const getStageKeyFromValue = (value) => {
    return Object.keys(PROJECT_STATUS).find(
      (key) => PROJECT_STATUS[key] === value
    );
  };

  // Get the display value from enum key
  const getStageValueFromKey = (key) => {
    return PROJECT_STATUS[key] || key;
  };

  // Test stage advancement with debug endpoint
  const testStageAdvancement = async (stageValue) => {
    try {
      const stageKey = getStageKeyFromValue(stageValue);

      const requestBody = {
        project_id: id,
        new_stage: stageKey,
      };

      const response = await fetch("/api/projects/debug/advance-stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Advance project stage
  const advanceStage = async (stageValue) => {
    try {
      setAdvancingStage(true);

      // Convert display value to enum key for the API
      const stageKey = getStageKeyFromValue(stageValue);
      if (!stageKey) {
        alert(`Invalid stage: ${stageValue}`);
        return;
      }

      const requestBody = {
        new_stage: stageKey,
        remarks: `Stage advanced to ${stageValue} via web interface`,
      };

      const response = await fetch(`/api/projects/${id}/stage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await fetchProjectData();
        alert(`Project advanced to ${stageValue} successfully!`);
        setShowAllStages(false);
      } else {
        // If normal advancement fails, try debug mode
        if (debugMode) {
          const debugResult = await testStageAdvancement(stageValue);
          alert(
            `Normal advancement failed. Debug result: ${debugResult.message}`
          );
        } else {
          throw new Error(result.message || "Failed to advance stage");
        }
      }
    } catch (error) {
      alert("Failed to advance stage: " + error.message);
    } finally {
      setAdvancingStage(false);
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
      currency: "MWK",
    }).format(amount || 0);
  };

  // Calculate BOQ total
  const calculateBOQTotal = () => {
    return boqItems.reduce((total, item) => total + (item.total_price || 0), 0);
  };

  // Get stage display name
  const getStageDisplayName = (stage) => {
    if (!stage) return "Unknown";

    // If stage is already a display value, return it
    if (Object.values(PROJECT_STATUS).includes(stage)) {
      return stage;
    }

    // If stage is an enum key, convert it
    return PROJECT_STATUS[stage] || stage?.replace(/_/g, " ") || stage;
  };

  // Get next logical stages based on your workflow
  const getNextStages = () => {
    const currentStage = project?.current_stage;

    // Convert current stage to display value for comparison
    const currentStageValue = getStageDisplayName(currentStage);

    const stageFlow = {
      [PROJECT_STATUS.DRAFT]: [PROJECT_STATUS.UNDER_DESIGN],
      [PROJECT_STATUS.UNDER_DESIGN]: [PROJECT_STATUS.AWAITING_COSTING],
      [PROJECT_STATUS.AWAITING_COSTING]: [
        PROJECT_STATUS.AWAITING_CUSTOMER_ACCEPTANCE,
      ],
      [PROJECT_STATUS.AWAITING_CUSTOMER_ACCEPTANCE]: [
        PROJECT_STATUS.AWAITING_PAYMENT,
      ],
      [PROJECT_STATUS.AWAITING_PAYMENT]: [PROJECT_STATUS.SURVEY_SCHEDULED],
      [PROJECT_STATUS.SURVEY_SCHEDULED]: [PROJECT_STATUS.SURVEY_COMPLETE],
      [PROJECT_STATUS.SURVEY_COMPLETE]: [
        PROJECT_STATUS.READY_FOR_CONFIGURATION,
      ],
      [PROJECT_STATUS.READY_FOR_CONFIGURATION]: [
        PROJECT_STATUS.READY_FOR_INSTALLATION,
      ],
      [PROJECT_STATUS.READY_FOR_INSTALLATION]: [
        PROJECT_STATUS.INSTALLATION_COMPLETE,
      ],
      [PROJECT_STATUS.INSTALLATION_COMPLETE]: [PROJECT_STATUS.SERVICE_LIVE],
      [PROJECT_STATUS.SERVICE_LIVE]: [],
    };

    return stageFlow[currentStageValue] || [];
  };

  // Get all stages for the dropdown
  const getAllStages = () => {
    // Return all stages except current one
    return Object.values(PROJECT_STATUS).filter(
      (stage) => stage !== getStageDisplayName(project?.current_stage)
    );
  };

  // Check if stage is completed in project history
  const isStageCompleted = (stageValue) => {
    if (!project?.stages) return false;

    // Convert stageValue to enum key for comparison
    const stageKey = getStageKeyFromValue(stageValue);

    return project.stages.some((s) => {
      const stageKeyFromHistory = getStageKeyFromValue(s.stage);
      return stageKeyFromHistory === stageKey && s.status === "COMPLETED";
    });
  };

  // Check if stage is the current stage
  const isCurrentStage = (stageValue) => {
    return getStageDisplayName(project?.current_stage) === stageValue;
  };

  // Helper function to render Yes/No fields
  const renderYesNoField = (value) => {
    return value === "Yes" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Yes
      </span>
    ) : value === "No" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        No
      </span>
    ) : (
      <span className="text-gray-500">Not specified</span>
    );
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading project details...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            className="bg-blue-600 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
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
            className="bg-blue-600 text-white px-3 py-1 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/home/projects")}
                className="flex items-center text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="hidden md:block">Back to Projects</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 hidden md:inline-block">
                  {project.project_code}
                </h1>
                <p className="text-gray-600">{project.customer_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-600 text-white px-2 py-2 cursor-pointer md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  <span className="">Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center bg-green-600 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {saving ? "Saving..." : <p>save</p>}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center bg-gray-600 text-white px-2 py-1 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors"
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
                  {/* <div className="space-y-1">
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
                  </div> */}

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

                  <div className="col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Information
                    </label>
                    {isEditing ? (
                      <textarea
                        name="project_information"
                        value={editForm.project_information || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Additional project details and information..."
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.project_information ||
                          "No additional information provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Requested Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Requested
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
                      VPN Aggregated Sites/Capacity
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="vpn_aggregated_sites"
                        value={editForm.vpn_aggregated_sites || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., 5 sites, 100Mbps capacity"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.vpn_aggregated_sites || "Not specified"}
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
                </div>
              </div>
            </div>

            {/* IT Personnel Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaUsers className="mr-2" />
                  IT Personnel
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </div>
            </div>

            {/* Infrastructure Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaServer className="mr-2" />
                  Infrastructure
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaNetworkWired className="mr-2 text-gray-400" />
                      Router/Firewall Present
                    </label>
                    {isEditing ? (
                      <select
                        name="router_firewall_present"
                        value={editForm.router_firewall_present || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.router_firewall_present)
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaGlobe className="mr-2 text-gray-400" />
                      Domain Hosted At
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="domain_hosted_at"
                        value={editForm.domain_hosted_at || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., GoDaddy, Namecheap, etc."
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.domain_hosted_at || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Row 2 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaMailBulk className="mr-2 text-gray-400" />
                      Mail Server at Client Site
                    </label>
                    {isEditing ? (
                      <select
                        name="mail_server_at_client_site"
                        value={editForm.mail_server_at_client_site || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.mail_server_at_client_site)
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaHdd className="mr-2 text-gray-400" />
                      Mail Server Version
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mail_server_version"
                        value={editForm.mail_server_version || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Exchange 2019, Postfix 3.x"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {project.mail_server_version || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Row 3 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email System Managed By
                    </label>
                    {isEditing ? (
                      <select
                        name="email_system_managed_by"
                        value={editForm.email_system_managed_by || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Internal IT">Internal IT</option>
                        <option value="ISP">ISP</option>
                        <option value="Third Party">Third Party</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {project.email_system_managed_by || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      DNS Server Present
                    </label>
                    {isEditing ? (
                      <select
                        name="dns_server_present"
                        value={editForm.dns_server_present || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.dns_server_present)
                    )}
                  </div>

                  {/* Row 4 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      DNS Managed By
                    </label>
                    {isEditing ? (
                      <select
                        name="dns_managed_by"
                        value={editForm.dns_managed_by || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Internal IT">Internal IT</option>
                        <option value="ISP">ISP</option>
                        <option value="Third Party">Third Party</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {project.dns_managed_by || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      LAN Present
                    </label>
                    {isEditing ? (
                      <select
                        name="lan_present"
                        value={editForm.lan_present || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.lan_present)
                    )}
                  </div>

                  {/* Row 5 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <FaBox className="mr-2 text-gray-400" />
                      Equipment Cabinet Present
                    </label>
                    {isEditing ? (
                      <select
                        name="equipment_cabinet_present"
                        value={editForm.equipment_cabinet_present || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.equipment_cabinet_present)
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Space Available in Cabinet
                    </label>
                    {isEditing ? (
                      <select
                        name="space_available_in_cabinet"
                        value={editForm.space_available_in_cabinet || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      renderYesNoField(project.space_available_in_cabinet)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Classification Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Classification
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Tasks Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaClock className="mr-2" />
                  Current Tasks
                </h2>
              </div>
              <div className="p-6">
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                              {getStageDisplayName(task.stage)}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                task.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {task.status?.replace("_", " ")}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Deadline:</span>{" "}
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString()
                                : "Not set"}
                            </div>
                            <div>
                              <span className="font-medium">
                                Time Remaining:
                              </span>{" "}
                              {task.time_remaining_hours
                                ? `${task.time_remaining_hours}h`
                                : "N/A"}
                            </div>
                          </div>

                          {task.is_overdue && (
                            <div className="mt-2 flex items-center text-red-600 text-sm">
                              <FaExclamationTriangle className="mr-1" />
                              Overdue
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaCheckCircle className="text-gray-400 text-3xl mx-auto mb-3" />
                    <p className="text-gray-500">
                      No active tasks for this project
                    </p>
                  </div>
                )}
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
            {/* Stage Advancement Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaRocket className="mr-2 text-blue-600" />
                  Advance Stage
                </h2>
              </div>
              <div className="p-6">
                {/* Current Stage Indicator */}
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      Current Stage:
                    </span>
                    <span className="text-sm font-semibold text-blue-900">
                      {getStageDisplayName(project.current_stage)}
                    </span>
                  </div>
                </div>

                {/* BOQ Management Button */}
                <div className="mb-4">
                  <NavLink to={`/home/projects/${id}/boq`}>
                    <button
                      // onClick={() => navigate(`/projects/${id}/boq`)}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded text-sm cursor-pointer hover:bg-purple-700 transition-colors font-medium text-center flex items-center justify-center gap-2"
                    >
                      <FaLayerGroup /> Manage BOQ
                    </button>
                  </NavLink>
                </div>

                {/* Quick Actions - Primary Buttons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Next Stages
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {nextStages.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => advanceStage(stage)}
                        disabled={advancingStage}
                        className="bg-blue-600 text-white py-3 px-4 rounded text-sm cursor-pointer hover:bg-blue-700 transition-colors font-medium text-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {advancingStage
                          ? "Advancing..."
                          : `Advance to ${stage}`}
                      </button>
                    ))}
                    {nextStages.length === 0 && (
                      <div className="text-center py-3 text-gray-500 text-sm bg-gray-50 rounded">
                        No next stages available
                      </div>
                    )}
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
            {/* Survey Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaFileAlt className="mr-2 text-green-600" />
                  Survey Report
                </h2>
              </div>
              <div className="p-6">
                {project.current_stage === "Survey Scheduled" ||
                project.current_stage === "Survey Complete" ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/home/projects/${id}/survey`)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded text-sm cursor-pointer hover:bg-green-700 transition-colors font-medium text-center"
                    >
                      {surveyExists
                        ? "View Survey Report"
                        : "Create Survey Report"}
                    </button>

                    {surveyExists && (
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Status:</strong> {survey.status}
                        </p>
                        <p>
                          <strong>Last Updated:</strong> {survey.updated_at}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    Survey available when project reaches Survey stage
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
