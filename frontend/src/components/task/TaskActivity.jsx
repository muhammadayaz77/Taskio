import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import useGetActivity from "../../hooks/task/useGetActivity";
import { getActionIcon } from "../../utils/getActionIcon.jsx"; // your icon function

function TaskActivity({ taskId }) {
  const { data, isPending } = useGetActivity(taskId);

  cso

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Loading activities...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {data && data.length > 0 ? (
          data.map((act) => (
            <div
              key={act._id}
              className="flex items-start gap-3 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {/* Icon */}
              <div className="mt-1">{getActionIcon(act.action)}</div>

              {/* Description + User + Timestamp */}
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{act.user?.name}</span>{" "}
                  {act.details?.description || ""}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(act.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No activity available</p>
        )}
      </CardContent>
    </Card>
  );
}

export default TaskActivity;