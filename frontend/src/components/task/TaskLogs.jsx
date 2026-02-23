import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import TaskActivity from "./TaskActivity";

function TaskLogs({ taskId }) {
  return (
    <div className="space-y-6">

      {/* Watchers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Watchers</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>No watchers added yet.</p>
        </CardContent>
      </Card>

      {/* Activity Section */}
      <TaskActivity />

    </div>
  );
}

export default TaskLogs;  