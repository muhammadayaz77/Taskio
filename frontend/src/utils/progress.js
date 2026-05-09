function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

/**
 * Weighted progress:
 * - Done task = 1.0 point
 * - In Progress task = 0.5 point
 * - To Do/others = 0 point
 * Progress % = ((done + inProgress*0.5) / totalTasks) * 100
 */
export function calculateTaskProgress(tasks = []) {
  const list = Array.isArray(tasks) ? tasks : [];
  const total = list.length;
  if (!total) {
    return { value: 0, done: 0, inProgress: 0, total: 0 };
  }

  let done = 0;
  let inProgress = 0;
  for (const task of list) {
    const status = normalizeStatus(task?.status);
    if (status === "done" || status === "completed") done += 1;
    else if (status === "in progress" || status === "in_progress") {
      inProgress += 1;
    }
  }

  const value = clamp(Math.round(((done + inProgress * 0.5) / total) * 100));
  return { value, done, inProgress, total };
}

export function getTaskStatusBreakdown(tasks = []) {
  const list = Array.isArray(tasks) ? tasks : [];
  const total = list.length;
  if (!total) {
    return {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      todoPct: 0,
      inProgressPct: 0,
      donePct: 0,
    };
  }

  let todo = 0;
  let inProgress = 0;
  let done = 0;

  for (const task of list) {
    const s = normalizeStatus(task?.status);
    if (s === "done" || s === "completed") done += 1;
    else if (s === "in progress" || s === "in_progress") inProgress += 1;
    else todo += 1;
  }

  return {
    total,
    todo,
    inProgress,
    done,
    todoPct: Math.round((todo / total) * 100),
    inProgressPct: Math.round((inProgress / total) * 100),
    donePct: Math.round((done / total) * 100),
  };
}

function progressFromProjectStatus(status) {
  const s = normalizeStatus(status);
  if (s === "completed" || s === "done") return 100;
  if (s === "in progress" || s === "in_progress") return 60;
  if (s === "on hold" || s === "on_hold") return 35;
  if (s === "planning") return 15;
  if (s === "cancelled" || s === "canceled") return 0;
  return 0;
}

export function getProjectProgress(project, tasksByProjectId = {}) {
  // Trust persisted progress only when non-zero (backend often keeps default 0).
  if (typeof project?.progress === "number" && project.progress > 0) {
    return clamp(Math.round(project.progress));
  }

  const byId = tasksByProjectId?.[project?._id];
  if (Array.isArray(byId)) {
    return calculateTaskProgress(byId).value;
  }

  if (Array.isArray(project?.tasks) && project.tasks.length > 0) {
    const hasTaskObjects = typeof project.tasks[0] === "object";
    if (hasTaskObjects) {
      return calculateTaskProgress(project.tasks).value;
    }
  }

  // Fallback when task list is not included in this payload.
  return progressFromProjectStatus(project?.status);
}

export function getProjectStatusBreakdown(project) {
  if (Array.isArray(project?.tasks) && project.tasks.length > 0) {
    const hasTaskObjects = typeof project.tasks[0] === "object";
    if (hasTaskObjects) {
      return getTaskStatusBreakdown(project.tasks);
    }
  }

  const s = normalizeStatus(project?.status);
  if (s === "completed" || s === "done") {
    return {
      total: 1,
      todo: 0,
      inProgress: 0,
      done: 1,
      todoPct: 0,
      inProgressPct: 0,
      donePct: 100,
    };
  }
  if (s === "in progress" || s === "in_progress" || s === "on hold" || s === "on_hold") {
    return {
      total: 1,
      todo: 0,
      inProgress: 1,
      done: 0,
      todoPct: 0,
      inProgressPct: 100,
      donePct: 0,
    };
  }
  return {
    total: 1,
    todo: 1,
    inProgress: 0,
    done: 0,
    todoPct: 100,
    inProgressPct: 0,
    donePct: 0,
  };
}
