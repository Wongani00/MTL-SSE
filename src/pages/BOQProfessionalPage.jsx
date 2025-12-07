// BOQProfessionalPage.jsx - UPDATED FOR YOUR BACKEND
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaPrint,
  FaDownload,
  FaFileExcel,
  FaCopy,
  FaUndo,
  FaArrowLeft,
  FaCalculator,
  FaCheck,
  FaFilePdf,
  FaHistory,
  FaLayerGroup,
  FaUpload,
  FaEye,
  FaCogs,
  FaChartBar,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";
import * as XLSX from "xlsx";

const BOQProfessionalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for BOQ documents list
  const [boqDocuments, setBoqDocuments] = useState([]);
  const [selectedBoq, setSelectedBoq] = useState(null);
  const [boqItems, setBoqItems] = useState([]);
  const [boqSummary, setBoqSummary] = useState({
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    grand_total: 0,
    item_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  // New BOQ form - MATCHING YOUR BACKEND MODEL
  const [newBoq, setNewBoq] = useState({
    title: "Bill of Quantities",
    company_name: "",
    currency: "MWK",
    tax_rate: 16.5,
    discount_percentage: 0,
    valid_until: "",
  });

  // New item form - MATCHING YOUR BOQItem MODEL
  const [newItem, setNewItem] = useState({
    item_number: "",
    item_type: "MATERIAL",
    category: "",
    description: "",
    specification: "",
    model: "",
    manufacturer: "",
    unit_of_measure: "Each",
    quantity: 1,
    unit_price: 0,
    is_taxable: true,
    lead_time: "",
    warranty_period: "",
    remarks: "",
    is_optional: false,
  });

  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProjectData();
    fetchBOQDocuments();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProject(result.data);
          setNewBoq((prev) => ({
            ...prev,
            company_name: result.data.customer_organization || "XX COMPANY",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const fetchBOQDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}/boq/documents`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setBoqDocuments(result.data);
          // Select the latest BOQ by default
          setSelectedBoq(result.data[0]);
          fetchBOQItems(result.data[0].id);
        } else {
          // No BOQs exist yet
          setBoqDocuments([]);
          setSelectedBoq(null);
          setBoqItems([]);
        }
      } else {
        console.log("BOQ documents endpoint not available yet");
        setBoqDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching BOQ documents:", error);
      setBoqDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBOQItems = async (boqId) => {
    try {
      const response = await fetch(`/api/projects/${id}/boq/${boqId}/items`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBoqItems(result.data.items || []);
          setBoqSummary(
            result.data.summary || {
              subtotal: 0,
              tax_amount: 0,
              discount_amount: 0,
              grand_total: 0,
              item_count: 0,
            }
          );
        }
      } else {
        console.log("BOQ items endpoint not available yet");
        setBoqItems([]);
      }
    } catch (error) {
      console.error("Error fetching BOQ items:", error);
      setBoqItems([]);
    }
  };

  const handleCreateBOQ = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${id}/boq/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newBoq),
      });

      const result = await response.json();

      if (result.success) {
        setShowCreateModal(false);
        alert("BOQ created successfully!");
        fetchBOQDocuments();

        // Reset form
        setNewBoq({
          title: "Bill of Quantities",
          company_name: project?.customer_organization || "XX COMPANY",
          currency: "MWK",
          tax_rate: 16.5,
          discount_percentage: 0,
          valid_until: "",
        });
      } else {
        alert("Failed to create BOQ: " + result.message);
      }
    } catch (error) {
      console.error("Error creating BOQ:", error);
      alert("Error creating BOQ");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!selectedBoq) {
      alert("Please select or create a BOQ first");
      return;
    }

    if (!newItem.description.trim() || !newItem.item_number.trim()) {
      alert("Please enter item number and description");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `/api/projects/${id}/boq/${selectedBoq.id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newItem),
        }
      );

      const result = await response.json();

      if (result.success) {
        setShowAddItemModal(false);
        alert("Item added successfully!");
        fetchBOQItems(selectedBoq.id);

        // Reset form
        setNewItem({
          item_number: "",
          item_type: "MATERIAL",
          category: "",
          description: "",
          specification: "",
          model: "",
          manufacturer: "",
          unit_of_measure: "Each",
          quantity: 1,
          unit_price: 0,
          is_taxable: true,
          lead_time: "",
          warranty_period: "",
          remarks: "",
          is_optional: false,
        });
      } else {
        alert("Failed to add item: " + result.message);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    if (!selectedBoq) return;

    try {
      // DELETE endpoint for individual items
      const response = await fetch(`/api/projects/${id}/boq/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Item deleted successfully!");
          fetchBOQItems(selectedBoq.id);
        } else {
          alert("Failed to delete item: " + result.message);
        }
      } else {
        alert("Delete endpoint not implemented yet");
        // For now, just refresh
        fetchBOQItems(selectedBoq.id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  const handleSubmitBOQ = async () => {
    if (!selectedBoq) return;

    if (!window.confirm("Submit this BOQ for approval?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${id}/boq/${selectedBoq.id}/submit`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("BOQ submitted for approval!");
        fetchBOQDocuments();
      } else {
        alert("Failed to submit BOQ: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting BOQ:", error);
      alert("Error submitting BOQ");
    }
  };

  const handleCloneBOQ = async () => {
    if (!selectedBoq) return;

    try {
      const response = await fetch(
        `/api/projects/${id}/boq/${selectedBoq.id}/clone`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("BOQ cloned successfully!");
        fetchBOQDocuments();
      } else {
        alert("Failed to clone BOQ: " + result.message);
      }
    } catch (error) {
      console.error("Error cloning BOQ:", error);
      alert("Error cloning BOQ");
    }
  };

  const exportToExcel = () => {
    if (boqItems.length === 0) {
      alert("No items to export");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Header sheet
    const headerData = [
      ["BILL OF QUANTITIES"],
      [""],
      ["BOQ Number:", selectedBoq?.boq_number || "N/A"],
      ["Project Code:", project?.project_code || "N/A"],
      ["Customer:", selectedBoq?.company_name || "N/A"],
      ["Date:", new Date().toLocaleDateString()],
      ["Currency:", selectedBoq?.currency || "MWK"],
      ["Status:", selectedBoq?.status || "Draft"],
      ["Tax Rate:", `${selectedBoq?.tax_rate || 0}%`],
      [""],
      ["Financial Summary:"],
      ["Subtotal:", boqSummary.subtotal],
      ["Tax Amount:", boqSummary.tax_amount],
      ["Discount:", boqSummary.discount_amount || 0],
      ["GRAND TOTAL:", boqSummary.grand_total],
    ];

    const headerSheet = XLSX.utils.aoa_to_sheet(headerData);
    XLSX.utils.book_append_sheet(workbook, headerSheet, "Summary");

    // Items sheet
    const itemsData = [
      [
        "Item No",
        "Type",
        "Category",
        "Description",
        "Specification",
        "Model",
        "Manufacturer",
        "Unit",
        "Qty",
        "Unit Price",
        "Total Price",
        "Taxable",
        "Tax Amount",
        "Lead Time",
        "Warranty",
        "Remarks",
        "Optional",
      ],
    ];

    boqItems.forEach((item) => {
      itemsData.push([
        item.item_number || "",
        item.item_type || "",
        item.category || "",
        item.description || "",
        item.specification || "",
        item.model || "",
        item.manufacturer || "",
        item.unit_of_measure || "Each",
        item.quantity || 0,
        item.unit_price || 0,
        item.total_price || 0,
        item.is_taxable ? "Yes" : "No",
        item.tax_amount || 0,
        item.lead_time || "",
        item.warranty_period || "",
        item.remarks || "",
        item.is_optional ? "Yes" : "No",
      ]);
    });

    const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");

    XLSX.writeFile(
      workbook,
      `Professional_BOQ_${selectedBoq?.boq_number || "Document"}.xlsx`
    );
  };

  const formatCurrency = (
    amount,
    currency = selectedBoq?.currency || "MWK"
  ) => {
    return `${currency} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "pending approval":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate(`/home/projects/${id}`)}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaArrowLeft /> Back{" "}
              <span className="hidden lg:inline-flex">to Project</span>
            </button>

            <div className="text-center">
              <h1 className="hidden md:inline-flex text-2xl font-bold text-gray-800">
                BOQ Management
              </h1>
              <p className="text-gray-600">
                Project: {project?.project_code || id}
              </p>
            </div>

            <div className="w-32"></div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - BOQ Documents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  BOQ Documents
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3 py-1 max-w-[83px] bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaPlus /> New
                </button>
              </div>

              {boqDocuments.length === 0 ? (
                <div className="text-center py-4">
                  <FaLayerGroup className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No BOQ documents yet</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200"
                  >
                    Create First BOQ
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {boqDocuments.map((boq) => (
                    <div
                      key={boq.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedBoq?.id === boq.id
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedBoq(boq);
                        fetchBOQItems(boq.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {boq.boq_number}
                          </h3>
                          <p className="text-sm text-gray-600">{boq.title}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            boq.status
                          )}`}
                        >
                          {boq.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          Version: {boq.version}.{boq.revision || 0}
                        </p>
                        <p>
                          Total:{" "}
                          {formatCurrency(boq.grand_total || 0, boq.currency)}
                        </p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Created:{" "}
                        {new Date(boq.prepared_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {selectedBoq && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Item
                  </button>
                  <button
                    onClick={handleSubmitBOQ}
                    disabled={selectedBoq.status !== "Draft"}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaCheck />{" "}
                    {selectedBoq.status === "Draft"
                      ? "Submit for Approval"
                      : "Approved"}
                  </button>
                  <button
                    onClick={exportToExcel}
                    disabled={boqItems.length === 0}
                    className="w-full px-4 py-2 bg-green-700 text-white rounded cursor-pointer hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FaFileExcel /> Export to Excel
                  </button>
                  {/* <button
                    onClick={handleCloneBOQ}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <FaCopy /> Clone BOQ
                  </button> */}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedBoq ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FaLayerGroup className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No BOQ Selected
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a BOQ document from the sidebar or create a new one
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <FaPlus /> Create New BOQ
                </button>
              </div>
            ) : (
              <>
                {/* BOQ Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedBoq.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            selectedBoq.status
                          )}`}
                        >
                          {selectedBoq.status}
                        </span>
                        <span className="text-gray-600">
                          {selectedBoq.boq_number}
                        </span>
                        <span className="text-gray-600">
                          v{selectedBoq.version}.{selectedBoq.revision || 0}
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-3xl font-bold text-gray-800">
                        {formatCurrency(boqSummary.grand_total)}
                      </p>
                      <p className="text-gray-600">Grand Total</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(boqSummary.subtotal)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Tax ({selectedBoq.tax_rate || 16.5}%)
                      </p>
                      <p className="text-xl font-bold">
                        {formatCurrency(boqSummary.tax_amount)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="text-xl font-bold">
                        {boqSummary.item_count}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="text-xl font-bold">
                        {selectedBoq.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="border-b">
                    <nav className="flex">
                      <button
                        onClick={() => setActiveTab("items")}
                        className={`px-6 py-3 font-medium cursor-pointer ${
                          activeTab === "items"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        <FaCogs className="inline mr-2" />
                        Items ({boqItems.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("summary")}
                        className={`px-6 py-3 font-medium cursor-pointer ${
                          activeTab === "summary"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        <FaChartBar className="inline mr-2" />
                        Summary
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === "items" && (
                      <div className="overflow-x-auto">
                        {boqItems.length === 0 ? (
                          <div className="text-center py-8">
                            <FaFileAlt className="text-5xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-700 mb-2">
                              No Items Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Add items to this BOQ to get started
                            </p>
                            <button
                              onClick={() => setShowAddItemModal(true)}
                              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                            >
                              Add First Item
                            </button>
                          </div>
                        ) : (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Item No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Qty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Unit Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {boqItems.map((item, index) => (
                                <tr
                                  key={item.id || index}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-medium">
                                      {item.item_number}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-semibold ${
                                        item.item_type === "MATERIAL"
                                          ? "bg-blue-100 text-blue-800"
                                          : item.item_type === "SERVICE"
                                          ? "bg-green-100 text-green-800"
                                          : item.item_type === "LABOR"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-purple-100 text-purple-800"
                                      }`}
                                    >
                                      {item.item_type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div>
                                      <p className="font-medium">
                                        {item.description}
                                      </p>
                                      {item.specification && (
                                        <p className="text-sm text-gray-600">
                                          {item.specification}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-medium">
                                      {item.quantity}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-1">
                                      {item.unit_of_measure}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {formatCurrency(item.unit_price)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                    {formatCurrency(item.total_price)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-2 text-red-600 cursor-pointer hover:text-red-800"
                                      title="Delete"
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {activeTab === "summary" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-gray-800 mb-4">
                              Breakdown by Type
                            </h4>
                            <div className="space-y-3">
                              {[
                                "MATERIAL",
                                "SERVICE",
                                "LABOR",
                                "EQUIPMENT",
                              ].map((type) => {
                                const typeItems = boqItems.filter(
                                  (item) => item.item_type === type
                                );
                                const typeTotal = typeItems.reduce(
                                  (sum, item) => sum + item.total_price,
                                  0
                                );
                                const typeCount = typeItems.length;

                                if (typeCount === 0) return null;

                                return (
                                  <div
                                    key={type}
                                    className="flex justify-between items-center"
                                  >
                                    <span className="font-medium">{type}</span>
                                    <div className="text-right">
                                      <p className="font-bold">
                                        {formatCurrency(typeTotal)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {typeCount} items
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-gray-800 mb-4">
                              Financial Summary
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>Subtotal</span>
                                <span className="font-bold">
                                  {formatCurrency(boqSummary.subtotal)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>
                                  Tax ({selectedBoq.tax_rate || 16.5}%)
                                </span>
                                <span className="font-bold text-green-600">
                                  {formatCurrency(boqSummary.tax_amount)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t">
                                <span className="font-bold text-lg">
                                  Grand Total
                                </span>
                                <span className="font-bold text-2xl">
                                  {formatCurrency(boqSummary.grand_total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create BOQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Create New BOQ
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BOQ Title
                  </label>
                  <input
                    type="text"
                    value={newBoq.title}
                    onChange={(e) =>
                      setNewBoq({ ...newBoq, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Bill of Quantities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newBoq.company_name}
                    onChange={(e) =>
                      setNewBoq({ ...newBoq, company_name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Company Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={newBoq.currency}
                      onChange={(e) =>
                        setNewBoq({ ...newBoq, currency: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="MWK">MWK</option>
                      {/* <option value="USD">USD</option>
                      <option value="ZAR">ZAR</option>
                      <option value="EUR">EUR</option> */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={newBoq.tax_rate}
                      onChange={(e) =>
                        setNewBoq({
                          ...newBoq,
                          tax_rate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newBoq.valid_until}
                    onChange={(e) =>
                      setNewBoq({ ...newBoq, valid_until: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBOQ}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create BOQ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Add New Item
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Number *
                  </label>
                  <input
                    type="text"
                    value={newItem.item_number}
                    onChange={(e) =>
                      setNewItem({ ...newItem, item_number: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., MAT-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type *
                  </label>
                  <select
                    value={newItem.item_type}
                    onChange={(e) =>
                      setNewItem({ ...newItem, item_type: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="MATERIAL">Material</option>
                    <option value="SERVICE">Service</option>
                    <option value="LABOR">Labour</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    rows="2"
                    placeholder="Item description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., Networking"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specification
                  </label>
                  <input
                    type="text"
                    value={newItem.specification}
                    onChange={(e) =>
                      setNewItem({ ...newItem, specification: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Technical specifications"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Price ({selectedBoq?.currency || "MWK"})
                    </label>
                    <input
                      type="number"
                      value={newItem.unit_price}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          unit_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.is_taxable}
                    onChange={(e) =>
                      setNewItem({ ...newItem, is_taxable: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Taxable Item
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newItem.is_optional}
                    onChange={(e) =>
                      setNewItem({ ...newItem, is_optional: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Optional Item
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={
                    saving ||
                    !newItem.item_number.trim() ||
                    !newItem.description.trim()
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOQProfessionalPage;
