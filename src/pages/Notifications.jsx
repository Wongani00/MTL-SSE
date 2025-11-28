import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaExclamationTriangle,
  FaFileAlt,
  FaRocket,
  FaTasks,
  FaTrash,
  FaFilter,
  FaSync,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [filter, setFilter] = useState("all"); // all, unread, urgent
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workflow/notifications", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNotifications(result.data || []);
        } else {
          setError(result.message || "Failed to load notifications");
        }
      } else {
        setError("Failed to load notifications - Server error");
      }
    } catch (error) {
      // console.error("Failed to fetch notifications:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notifications as read
  const markAsRead = async (notificationIds = []) => {
    try {
      setMarkingAsRead(true);

      const requestBody = {
        notification_ids: notificationIds,
      };

      const response = await fetch("/api/workflow/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh notifications
        await fetchNotifications();
        // Clear selection
        setSelectedNotifications(new Set());
        alert("Notifications marked as read successfully!");
      } else {
        throw new Error(
          result.message || "Failed to mark notifications as read"
        );
      }
    } catch (error) {
      // console.error("Failed to mark notifications as read:", error);
      alert("Failed to mark notifications as read: " + error.message);
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    const unreadNotificationIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (unreadNotificationIds.length === 0) {
      alert("No unread notifications to mark as read.");
      return;
    }

    markAsRead(unreadNotificationIds);
  };

  // Mark selected as read
  const markSelectedAsRead = () => {
    if (selectedNotifications.size === 0) {
      alert("Please select notifications to mark as read.");
      return;
    }

    markAsRead(Array.from(selectedNotifications));
  };

  // Toggle notification selection
  const toggleNotificationSelection = (notificationId) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId);
    } else {
      newSelection.add(notificationId);
    }
    setSelectedNotifications(newSelection);
  };

  // Select all visible notifications
  const selectAllVisible = () => {
    const visibleNotificationIds = filteredNotifications.map((n) => n.id);
    setSelectedNotifications(new Set(visibleNotificationIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };

  // Refresh notifications
  const refreshNotifications = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type, isUrgent) => {
    if (isUrgent) {
      return <FaExclamationTriangle className="text-red-500" />;
    }

    switch (type) {
      case "TASK_ASSIGNED":
        return <FaTasks className="text-blue-500" />;
      case "STAGE_CHANGE":
        return <FaRocket className="text-green-500" />;
      case "SLA_ALERT":
        return <FaExclamationTriangle className="text-orange-500" />;
      case "DOCUMENT_UPLOADED":
        return <FaFileAlt className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  // Get notification type display name
  const getNotificationTypeDisplay = (type) => {
    const typeMap = {
      TASK_ASSIGNED: "Task Assigned",
      STAGE_CHANGE: "Stage Change",
      SLA_ALERT: "SLA Alert",
      DOCUMENT_UPLOADED: "Document Uploaded",
    };
    return typeMap[type] || type;
  };

  // Get notification background color
  const getNotificationBgColor = (isRead, isUrgent) => {
    if (isUrgent && !isRead) {
      return "bg-red-50 border-red-200";
    }
    if (!isRead) {
      return "bg-blue-50 border-blue-200";
    }
    return "bg-white border-gray-200";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.is_read;
      case "urgent":
        return notification.is_urgent;
      default:
        return true;
    }
  });

  // Stats
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.is_read).length,
    urgent: notifications.filter((n) => n.is_urgent).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>MTL SSE - Notifications</title>
        <meta name="description" content="User notifications and alerts" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaBell className="text-2xl text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Notifications
                  </h1>
                  <p className="text-gray-600">
                    {stats.unread} unread of {stats.total} total notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={refreshNotifications}
                disabled={refreshing}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <FaSync
                  className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              {stats.unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={markingAsRead}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaCheckDouble className="mr-2" />
                  {markingAsRead ? "Marking..." : "Mark All Read"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-600 mr-2" />
              <span className="font-semibold">Error</span>
            </div>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats and Filters */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <FaBell className="text-2xl text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.unread}
                  </p>
                </div>
                <FaEyeSlash className="text-2xl text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.urgent}
                  </p>
                </div>
                <FaExclamationTriangle className="text-2xl text-red-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total - stats.unread}
                  </p>
                </div>
                <FaEye className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          {/* Filters and Bulk Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Notifications</option>
                    <option value="unread">Unread Only</option>
                    <option value="urgent">Urgent Only</option>
                  </select>
                </div>

                {selectedNotifications.size > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedNotifications.size} selected
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {selectedNotifications.size > 0 ? (
                  <>
                    <button
                      onClick={markSelectedAsRead}
                      disabled={markingAsRead}
                      className="flex items-center bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {markingAsRead ? "Marking..." : "Mark Selected Read"}
                    </button>
                    <button
                      onClick={clearSelection}
                      className="flex items-center bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      <FaTrash className="mr-1" />
                      Clear Selection
                    </button>
                  </>
                ) : (
                  <button
                    onClick={selectAllVisible}
                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <FaCheck className="mr-1" />
                    Select All Visible
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-6">
              <FaBell className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 border-l-4 ${
                    notification.is_urgent && !notification.is_read
                      ? "border-l-red-500"
                      : !notification.is_read
                      ? "border-l-blue-500"
                      : "border-l-gray-300"
                  } ${getNotificationBgColor(
                    notification.is_read,
                    notification.is_urgent
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() =>
                          toggleNotificationSelection(notification.id)
                        }
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />

                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(
                          notification.notification_type,
                          notification.is_urgent
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                          </p>
                          {notification.is_urgent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FaExclamationTriangle className="mr-1" />
                              Urgent
                            </span>
                          )}
                          {!notification.is_read && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Unread
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="capitalize">
                            {getNotificationTypeDisplay(
                              notification.notification_type
                            )}
                          </span>

                          {notification.project_code && (
                            <span className="font-medium">
                              Project: {notification.project_code}
                            </span>
                          )}

                          <span>{formatDate(notification.created_at)}</span>
                        </div>

                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead([notification.id])}
                            disabled={markingAsRead}
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            <FaCheck className="mr-1" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {notification.is_read && (
                        <FaCheck className="text-green-500" title="Read" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty state for no notifications at all */}
        {notifications.length === 0 && !loading && (
          <div className="text-center py-6">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 mb-6">
              You'll see important updates and alerts here when they become
              available.
            </p>
            <button
              onClick={refreshNotifications}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Check for new notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
