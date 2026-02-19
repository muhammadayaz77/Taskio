function TaskLogs({ taskId }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Activity Logs</h3>

      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Task created</p>
        <p>Description updated</p>
        <p>Status changed to In Progress</p>
      </div>
    </div>
  );
}

export default TaskLogs;
