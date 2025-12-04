import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaFileAlt,
  FaSave,
  FaPaperPlane,
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaNetworkWired,
  // FaTowerCell,
  FaRoute,
} from "react-icons/fa";

const SurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("view"); // view, edit
  const [formData, setFormData] = useState({
    survey_date: new Date().toISOString().split("T")[0],
    customer_name: "",
    site_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    site_location: "",
    latitude: 0,
    longitude: 0,
    altitude: 0,
    // Requirements
    router_required: false,
    switch_required: false,
    ip_phone_required: false,
    lan_required: false,
    internal_wiring_required: false,
    block_terminals_required: false,
    creats_distribution_box_required: false,
    voip_gateway_required: false,
    legacy_handset_required: false,
    wireless_ap_required: false,
    power_extension_required: false,
    // Transmission
    mounting_structure_type: "",
    supporting_mechanism: "",
    transmission_materials: "",
    ethernet_cable_length: 0,
    cable_trunking_length: 0,
    cable_piping_length: 0,
    other_materials: "",
    other_comments: "",
    // Location
    mtl_side_location: "",
    mtl_latitude: 0,
    mtl_longitude: 0,
    // Backhaul
    backhaul_platform: "",
    backhaul_owner: "",
    backhaul_route: "",
    additional_requirements: "",
    // Comments
    surveyor_comment: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}/survey`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSurvey(result.data);
          setFormData(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${id}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        await fetchSurvey();
        setMode("view");
        alert("Survey saved successfully!");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert("Failed to save survey: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit survey for approval?")) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/projects/${id}/survey/submit`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        await fetchSurvey();
        alert("Survey submitted for approval!");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert("Failed to submit survey: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/survey/print`, {
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        // Open print dialog with formatted data
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Survey Report - ${result.data.project_info.code}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 20px; font-weight: bold; margin: 20px 0; }
                .section { margin-bottom: 30px; }
                .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .signature { margin-top: 50px; padding-top: 20px; border-top: 1px solid #000; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>${result.data.header}</h2>
                <h3 class="title">${result.data.title}</h3>
                <p>Date of survey: ${result.data.survey_date}</p>
              </div>
              
              <div class="section">
                <div class="section-title">Customer Information</div>
                <p><strong>Customer Name:</strong> ${
                  result.data.customer_name
                }</p>
                <p><strong>Site Name:</strong> ${result.data.site_name}</p>
                <p><strong>Contact Person:</strong> ${
                  result.data.contact_person.name
                }</p>
                <p><strong>Email:</strong> ${
                  result.data.contact_person.email
                }</p>
                <p><strong>Phone:</strong> ${
                  result.data.contact_person.phone
                }</p>
                <p><strong>Site Location:</strong> ${
                  result.data.site_location
                }</p>
                <p><strong>Coordinates:</strong> Lat: ${
                  result.data.coordinates.latitude
                }, Long: ${result.data.coordinates.longitude}, Alt: ${
          result.data.coordinates.altitude
        }m</p>
              </div>
              
              <div class="section">
                <div class="section-title">Customer Requirements</div>
                <table>
                  ${Object.entries(result.data.customer_requirements)
                    .map(
                      ([key, value]) => `
                      <tr>
                        <td width="60%">${key}</td>
                        <td width="40%">${value}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </table>
              </div>
              
              <div class="section">
                <div class="section-title">Transmission Requirements</div>
                <p><strong>Mounting Structure:</strong> ${
                  result.data.transmission_requirements.mounting_structure
                }</p>
                <p><strong>Supporting Mechanism:</strong> ${
                  result.data.transmission_requirements.supporting_mechanism
                }</p>
                <p><strong>Materials:</strong> ${
                  result.data.transmission_requirements.materials
                }</p>
                <p><strong>Ethernet Cable:</strong> ${
                  result.data.transmission_requirements.ethernet_cable
                }</p>
                <p><strong>Cable Trunking:</strong> ${
                  result.data.transmission_requirements.cable_trunking
                }</p>
                <p><strong>Cable Piping:</strong> ${
                  result.data.transmission_requirements.cable_piping
                }</p>
                <p><strong>Other Materials:</strong> ${
                  result.data.transmission_requirements.other_materials
                }</p>
                <p><strong>Other Comments:</strong> ${
                  result.data.transmission_requirements.other_comments
                }</p>
              </div>
              
              <div class="section">
                <div class="section-title">Approvals</div>
                <div class="signature">
                  <p><strong>Surveyor:</strong> ${
                    result.data.comments.surveyor_name
                  }</p>
                  <p>${result.data.comments.surveyor}</p>
                </div>
                <div class="signature">
                  <p><strong>Manager (Enterprise Solutions):</strong> ${
                    result.data.comments.manager_name
                  }</p>
                  <p>${result.data.comments.manager}</p>
                </div>
                <div class="signature">
                  <p><strong>HOD (SSE):</strong> ${
                    result.data.comments.hod_name
                  }</p>
                  <p>${result.data.comments.hod}</p>
                </div>
                <div class="signature">
                  <p><strong>COO:</strong> ${result.data.comments.coo_name}</p>
                  <p>${result.data.comments.coo}</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error("Failed to print:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>MTL SSE - Survey Report</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-4">
              <FaFileAlt className="text-2xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Customer Survey Report
                </h1>
                <p className="text-gray-600">
                  {survey ? survey.customer_name : "New Survey"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {mode === "view" ? (
                <>
                  <button
                    onClick={() => setMode("edit")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  {survey?.status === "DRAFT" && (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <FaPaperPlane className="inline mr-2" />
                      {submitting ? "Submitting..." : "Submit for Approval"}
                    </button>
                  )}
                  <button
                    onClick={handlePrint}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaPrint className="inline mr-2" />
                    Print
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="inline mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setMode("view");
                      if (survey) setFormData(survey);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold">
                MALAWI TELECOMMUNICATIONS LIMITED
              </h2>
              <h3 className="text-lg font-semibold mt-2">
                CUSTOMER SURVEY REPORT FOR{" "}
                {formData.customer_name || "CUSTOMER"}
              </h3>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of survey
                  </label>
                  <input
                    type="date"
                    name="survey_date"
                    value={formData.survey_date}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Customer Requirements - Yes/No Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Customer Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "router_required",
                  "switch_required",
                  "ip_phone_required",
                  "lan_required",
                  "internal_wiring_required",
                  "block_terminals_required",
                  "creats_distribution_box_required",
                  "voip_gateway_required",
                  "legacy_handset_required",
                  "wireless_ap_required",
                  "power_extension_required",
                ].map((field) => (
                  <div key={field} className="flex items-center">
                    <input
                      type="checkbox"
                      id={field}
                      name={field}
                      checked={formData[field]}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor={field}
                      className="ml-2 text-sm text-gray-700 capitalize"
                    >
                      {field.replace(/_required/, "").replace(/_/g, " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission Requirements */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Transmission Requirements
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mounting Structure Type
                    </label>
                    <input
                      type="text"
                      name="mounting_structure_type"
                      value={formData.mounting_structure_type}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., pole/mast/tower"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supporting Mechanism
                    </label>
                    <input
                      type="text"
                      name="supporting_mechanism"
                      value={formData.supporting_mechanism}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., wall/ground/guide wires"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Materials Required
                  </label>
                  <textarea
                    name="transmission_materials"
                    value={formData.transmission_materials}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    rows="3"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="List all materials and quantities..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ethernet Cable Length (m)
                    </label>
                    <input
                      type="number"
                      name="ethernet_cable_length"
                      value={formData.ethernet_cable_length}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cable Trunking Length (m)
                    </label>
                    <input
                      type="number"
                      name="cable_trunking_length"
                      value={formData.cable_trunking_length}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cable Piping Length (m)
                    </label>
                    <input
                      type="number"
                      name="cable_piping_length"
                      value={formData.cable_piping_length}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Backhaul Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Backhaul Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Backhaul Platform
                  </label>
                  <select
                    name="backhaul_platform"
                    value={formData.backhaul_platform}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Platform</option>
                    <option value="Radio">Radio</option>
                    <option value="ADM">ADM</option>
                    <option value="Switch">Switch</option>
                    <option value="MPLS Router">MPLS Router</option>
                    <option value="Fiber">Fiber</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Owner of Backhaul Link
                  </label>
                  <input
                    type="text"
                    name="backhaul_owner"
                    value={formData.backhaul_owner}
                    onChange={handleInputChange}
                    disabled={mode === "view"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Surveyor Comments */}
            {mode === "edit" && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                  Surveyor's Comments
                </h3>
                <textarea
                  name="surveyor_comment"
                  value={formData.surveyor_comment}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter your comments and observations..."
                />
              </div>
            )}

            {/* Status Display */}
            {survey && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Approval Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Surveyor
                    </p>
                    <p className="font-semibold">
                      {survey.surveyor_name || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Manager</p>
                    <p className="font-semibold">
                      {survey.manager_name || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      HOD (SSE)
                    </p>
                    <p className="font-semibold">
                      {survey.hod_name || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">COO</p>
                    <p className="font-semibold">
                      {survey.coo_name || "Pending"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      survey.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : survey.status === "SUBMITTED"
                        ? "bg-blue-100 text-blue-800"
                        : survey.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
