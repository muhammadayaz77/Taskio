import activityLog from "../models/activity";

export const recordActivity = async (
  userId,
  action,
  resourceType,
  resourceId,
  details,
) => {
  try {
    await activityLog.create({
      user: userId,
      action,
      resourceType,
      resourceId,
      details,
    });
  } catch (error) {
    console.log("Activity Log Error :", error);
  }
};
