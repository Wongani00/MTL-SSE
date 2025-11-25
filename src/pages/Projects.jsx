import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useAuth } from "../hooks/UseAuth";

const Projects = () => {
  const user = useAuth();
  const [projects, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          setProject(result.data);
        } else {
          alert(result.message || "Failed to delete user");
        }
      } catch (error) {
        alert("failed to load data, please try again. ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjectData();
    }
  }, [user]);

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

      {/* table for user information */}
      <div className="bg-white rounded-lg my-3 shadow-sm border border-gray-200">
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing all available Projects
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-[midnightblue] rounded-md font-sm px-4 py-2 text-white cursor-pointer transition duration-200 hover:font-semibold">
              Add
            </button>
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
                  Customer Name
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
                  Current stage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created at
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  created by
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
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.project_code}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.customer_name}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.service_type}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.current_stage}
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.created_at}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {project.created_by}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                        Edit
                      </button>
                      <NavLink to={`${project.id}`}>
                        <button className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors">
                          {<FaEye size={24} />}
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
    </div>
  );
};

export default Projects;
