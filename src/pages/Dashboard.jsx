import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaBuilding,
  FaArrowRight,
  FaCog,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [commercial, setCommercial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data
        const [overviewRes, pipelineRes] = await Promise.all([
          fetch("/api/dashboard/overview", { credentials: "include" }),
          fetch("/api/dashboard/pipeline", { credentials: "include" }),
        ]);

        if (overviewRes.ok && pipelineRes.ok) {
          const overviewData = await overviewRes.json();
          const pipelineData = await pipelineRes.json();

          if (overviewData.success) setOverview(overviewData.data);
          if (pipelineData.success) setPipeline(pipelineData.data);
        }

        // Fetch performance and commercial data if user has access
        try {
          const [performanceRes, commercialRes] = await Promise.all([
            fetch("/api/dashboard/reports/performance", {
              credentials: "include",
            }),
            fetch("/api/dashboard/reports/commercial", {
              credentials: "include",
            }),
          ]);

          if (performanceRes.ok) {
            const performanceData = await performanceRes.json();
            if (performanceData.success) setPerformance(performanceData.data);
          }

          if (commercialRes.ok) {
            const commercialData = await commercialRes.json();
            if (commercialData.success) setCommercial(commercialData.data);
          }
        } catch (error) {
          console.log(
            "Additional reports not accessible for current user role"
          );
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
          content="Dashboard - Overview of projects and performance metrics"
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Project overview and performance metrics
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("pipeline")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "pipeline"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "performance"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab("commercial")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "commercial"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Commercial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewTab overview={overview} />}
        {activeTab === "pipeline" && <PipelineTab pipeline={pipeline} />}
        {activeTab === "performance" && (
          <PerformanceTab performance={performance} />
        )}
        {activeTab === "commercial" && (
          <CommercialTab commercial={commercial} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ overview }) => {
  if (!overview) return <div>No overview data available</div>;

  const { summary, stage_distribution, recent_activity } = overview;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SummaryCard
          icon={<FaProjectDiagram className="text-blue-600" />}
          title="Total Projects"
          value={summary.total_projects}
          color="blue"
        />
        <SummaryCard
          icon={<FaTasks className="text-green-600" />}
          title="Active Projects"
          value={summary.active_projects}
          color="green"
        />
        <SummaryCard
          icon={<FaCheckCircle className="text-purple-600" />}
          title="Completed"
          value={summary.completed_projects}
          color="purple"
        />
        <SummaryCard
          icon={<FaClock className="text-orange-600" />}
          title="My Tasks"
          value={summary.user_tasks}
          color="orange"
        />
        <SummaryCard
          icon={<FaExclamationTriangle className="text-red-600" />}
          title="Overdue"
          value={summary.overdue_tasks}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaChartPie className="mr-2" />
              Project Stage Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stage_distribution).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {stage.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / summary.total_projects) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaClock className="mr-2" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recent_activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      activity.status === "COMPLETED"
                        ? "bg-green-500"
                        : activity.status === "IN_PROGRESS"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.project_code}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {activity.stage.replace(/_/g, " ")} •{" "}
                      {activity.status.replace(/_/g, " ").toLowerCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()} •{" "}
                      {activity.assigned_to}
                    </p>
                  </div>
                </div>
              ))}
              {recent_activity.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pipeline Tab Component
const PipelineTab = ({ pipeline }) => {
  if (!pipeline) return <div>No pipeline data available</div>;

  const stages = Object.entries(pipeline);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaProjectDiagram className="mr-2" />
            Project Pipeline
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track projects across different stages
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map(([stage, projects]) => (
              <PipelineColumn key={stage} stage={stage} projects={projects} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ performance }) => {
  if (!performance)
    return (
      <div className="text-center py-8">
        <FaChartBar className="text-gray-400 text-4xl mx-auto mb-4" />
        <p className="text-gray-600">
          Performance reports are only available for managers and administrators
        </p>
      </div>
    );

  const { cycle_times, department_performance, sla_metrics, active_breaches } =
    performance;

  return (
    <div className="space-y-6">
      {/* SLA Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="SLA Compliance Rate"
          value={`${sla_metrics.compliance_rate}%`}
          subtitle={`${sla_metrics.on_time_completions} of ${sla_metrics.total_completed_stages} stages`}
          icon={<FaCheckCircle className="text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Active SLA Breaches"
          value={active_breaches}
          subtitle="Requiring attention"
          icon={<FaExclamationTriangle className="text-red-600" />}
          color="red"
        />
        <MetricCard
          title="Completed Stages"
          value={sla_metrics.total_completed_stages}
          subtitle="Total processed"
          icon={<FaTasks className="text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="On-time Completions"
          value={sla_metrics.on_time_completions}
          subtitle="Met deadline"
          icon={<FaClock className="text-purple-600" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Times */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Average Cycle Times (Hours)
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(cycle_times).map(([stage, hours]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {stage.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((hours / 100) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Department Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(department_performance).map(([dept, stats]) => (
                <div
                  key={dept}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">{dept}</p>
                    <p className="text-sm text-gray-600">
                      {stats.completed_tasks} tasks • Avg:{" "}
                      {stats.avg_completion_hours}h
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        stats.avg_completion_hours < 24
                          ? "bg-green-100 text-green-800"
                          : stats.avg_completion_hours < 72
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stats.avg_completion_hours < 24
                        ? "Fast"
                        : stats.avg_completion_hours < 72
                        ? "Moderate"
                        : "Slow"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Commercial Tab Component
const CommercialTab = ({ commercial }) => {
  if (!commercial)
    return (
      <div className="text-center py-8">
        <FaDollarSign className="text-gray-400 text-4xl mx-auto mb-4" />
        <p className="text-gray-600">
          Commercial reports are only available for commercial team and managers
        </p>
      </div>
    );

  const { revenue_pipeline, conversion_metrics, monthly_performance } =
    commercial;

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Pipeline Value"
          value={`$${(revenue_pipeline.total_value / 1000).toFixed(1)}K`}
          subtitle="Across all stages"
          icon={<FaDollarSign className="text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversion_metrics.conversion_rate}%`}
          subtitle={`${conversion_metrics.converted_quotes} of ${conversion_metrics.total_quotes}`}
          icon={<FaChartLine className="text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Monthly Projects"
          value={monthly_performance.new_projects}
          subtitle={`${monthly_performance.completed_projects} completed`}
          icon={<FaBuilding className="text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Revenue by Stage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Revenue Pipeline by Stage
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(revenue_pipeline.by_stage).map(
              ([stage, revenue]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {stage.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${
                            (revenue / revenue_pipeline.total_value) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      ${(revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SummaryCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 ${colorClasses[color]}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    red: "bg-red-50 border-red-200",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

const PipelineColumn = ({ stage, projects }) => {
  const getStageColor = (stage) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      QUOTATION: "bg-blue-100 text-blue-800",
      AWAITING_CUSTOMER_ACCEPTANCE: "bg-yellow-100 text-yellow-800",
      AWAITING_PAYMENT: "bg-orange-100 text-orange-800",
      SURVEY_SCHEDULED: "bg-purple-100 text-purple-800",
      READY_FOR_CONFIGURATION: "bg-indigo-100 text-indigo-800",
      READY_FOR_INSTALLATION: "bg-pink-100 text-pink-800",
      INSTALLATION_COMPLETE: "bg-green-100 text-green-800",
      SERVICE_LIVE: "bg-green-100 text-green-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 capitalize">
          {stage.replace(/_/g, " ")}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(
            stage
          )}`}
        >
          {projects.length}
        </span>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-xs border p-3"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm text-gray-900">
                {project.project_code}
              </h4>
              {project.is_overdue && (
                <FaExclamationTriangle className="text-red-500 text-xs" />
              )}
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {project.customer_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {project.service_type}
            </p>
            {project.assigned_to && (
              <p className="text-xs text-gray-500 mt-1">
                Assigned: {project.assigned_to}
              </p>
            )}
            {project.deadline && (
              <p
                className={`text-xs mt-1 ${
                  project.is_overdue ? "text-red-600" : "text-gray-500"
                }`}
              >
                Due: {new Date(project.deadline).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-gray-500 text-center py-4 text-sm">No projects</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
