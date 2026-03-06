import React from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function RecentProjects({ data }) {

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "Planning") return "bg-yellow-100 text-yellow-700";

    return "bg-gray-100 text-gray-700";
  };

  const truncate = (text, limit = 20) => {
    if (!text) return "No description";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  return (
    <div className="col-span-12 lg:col-span-6 mt-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-3">Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>
                {data.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="py-3 font-medium text-gray-800">
                      <Link
                        to={`/workspaces/${project.workspace}/projects/${project._id}`}
                        className="block w-full"
                      >
                        {project.title}
                      </Link>
                    </td>

                    <td className="text-gray-600">
                      <Link
                        to={`/workspaces/${project.workspace}/projects/${project._id}`}
                        className="block w-full"
                      >
                        {truncate(project.description, 20)}
                      </Link>
                    </td>

                    <td>
                      <Link
                        to={`/workspaces/${project.workspace}/projects/${project._id}`}
                        className="block w-full"
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </Link>
                    </td>

                    <td className="text-gray-500">
                      <Link
                        to={`/workspaces/${project.workspace}/projects/${project._id}`}
                        className="block w-full"
                      >
                        {new Date(project.dueDate).toLocaleDateString()}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecentProjects;