import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import useUpdateTaskStatus from "../../hooks/task/useUpdateTaskStatus";

const STATUSES = ["To Do", "In Progress", "Done"];

function groupByStatus(tasks) {
  const map = { "To Do": [], "In Progress": [], Done: [] };
  for (const t of tasks || []) {
    if (map[t.status]) map[t.status].push(t);
    else map["To Do"].push(t);
  }
  return map;
}

export default function TaskBoard({
  tasks,
  projectId,
  onOpenTask,
  onAddTask,
  visibleStatuses,
}) {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const [activeTask, setActiveTask] = useState(null);

  const grouped = useMemo(() => groupByStatus(tasks), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTask = (id) => (tasks || []).find((t) => t._id === id);

  function handleDragStart(event) {
    const id = event.active?.id;
    setActiveTask(findTask(id) || null);
  }

  function resolveTargetStatus(over) {
    if (!over) return null;
    const overData = over.data?.current;
    if (overData?.type === "column") return overData.status;
    if (overData?.type === "task") return overData.task?.status;
    if (typeof over.id === "string" && over.id.startsWith("column:")) {
      return over.id.replace("column:", "");
    }
    return null;
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const task = findTask(active.id);
    if (!task) return;

    const target = resolveTargetStatus(over);
    if (!target || target === task.status) return;
    if (!STATUSES.includes(target)) return;

    updateStatus({
      taskId: task._id,
      status: target,
      projectId,
    });
  }

  const columns = visibleStatuses?.length
    ? visibleStatuses.filter((s) => STATUSES.includes(s))
    : STATUSES;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div
        className={`grid gap-4 ${
          columns.length === 1
            ? "grid-cols-1"
            : columns.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {columns.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={grouped[status] || []}
            onOpenTask={onOpenTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
