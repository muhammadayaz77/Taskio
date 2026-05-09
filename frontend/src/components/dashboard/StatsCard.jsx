import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, CheckCircle, ListTodo, Clock } from "lucide-react";

function StatsCard({ data }) {
  const stats = [
    {
      title: "Total Projects",
      value: data?.totalProjects || 0,
      subtitle: `${data?.totalProjectProgress} Project(s) in progress`,
      icon: <Folder className="w-5 h-5 text-violet-600" />,
    },
    {
      title: "Total Tasks",
      value: data?.totalTasks || 0,
      subtitle: `${data?.totalTaskCompleted} Task(s) completed`,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "Tasks Todo",
      value: data?.totalTaskTodo || 0,
      subtitle: "Tasks waiting to be done",
      icon: <ListTodo className="w-5 h-5 text-slate-600" />,
    },
    {
      title: "Tasks In Progress",
      value: data?.totalTaskInProgress || 0,
      subtitle: "Tasks currently in progress",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-slate-200/90 bg-white shadow-sm transition hover:border-violet-200/80 hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {stat.title}
            </CardTitle>

            <div className="rounded-lg bg-violet-50 p-2 ring-1 ring-violet-100">
              {stat.icon}
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <p className="mt-1 text-xs text-slate-500">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCard;