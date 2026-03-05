import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, CheckCircle, ListTodo, Clock } from "lucide-react";

function StatsCard({ data }) {
  const stats = [
    {
      title: "Total Projects",
      value: data?.totalProjects || 0,
      subtitle: `${data?.totalProjectProgress} Project(s) in progress`,
      icon: <Folder className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: "Total Tasks",
      value: data?.totalTasks || 0,
      subtitle: `${data?.totalTaskCompleted} Task(s) completed`,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    {
      title: "Tasks Todo",
      value: data?.totalTaskTodo || 0,
      subtitle: "Tasks waiting to be done",
      icon: <ListTodo className="w-5 h-5 text-gray-600" />,
    },
    {
      title: "Tasks In Progress",
      value: data?.totalTaskInProgress || 0,
      subtitle: "Tasks currently in progress",
      icon: <Clock className="w-5 h-5 text-orange-600" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-gray-200 hover:shadow-md transition"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>

            <div className="p-2 bg-gray-100 rounded-md">{stat.icon}</div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCard;