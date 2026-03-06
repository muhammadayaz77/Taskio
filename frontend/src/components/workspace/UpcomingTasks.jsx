import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function UpcomingTasks({ data }) {

  const priorityColor = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
    if (priority === "Low") return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-700";
  };

  const statusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "To Do") return "bg-gray-100 text-gray-700";

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="col-span-12 lg:col-span-6 mt-6">
      <Card className="h-full">
        
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <p className="text-sm text-gray-500">
            Tasks that are due soon
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {data.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              
              {/* Left section */}
              <div>
                <p className="font-medium text-gray-800">
                  {task.title}
                </p>

                <p className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>

              {/* Right section */}
              <div className="flex gap-2">
                
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

              </div>
            </div>
          ))}
        </CardContent>

      </Card>
    </div>
  );
}

export default UpcomingTasks;