import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Compares `workspaceId` to workspaces loaded in Redux (from GET /workspaces).
 * Before the list is loaded, `memberOf` stays true so the server still authorizes.
 * After load, if the id is not in the user's workspaces, `denyClient` is true (bad URL / not a member).
 */
export function useWorkspaceMembership(workspaceId) {
  const { workspaces } = useSelector((s) => s.workspace);

  return useMemo(() => {
    const loaded = workspaces.length > 0;
    const memberOf =
      !workspaceId ||
      !loaded ||
      workspaces.some((w) => String(w._id) === String(workspaceId));

    const denyClient =
      Boolean(workspaceId) &&
      loaded &&
      !workspaces.some((w) => String(w._id) === String(workspaceId));

    return { memberOf, denyClient, loaded };
  }, [workspaceId, workspaces]);
}
