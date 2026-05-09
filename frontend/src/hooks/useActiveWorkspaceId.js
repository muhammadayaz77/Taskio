import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

/** Paths where ?workspaceId= should be preserved when navigating from the sidebar */
const WORKSPACE_SCOPED_PATHS = new Set(["/dashboard", "/members", "/archive"]);

/**
 * Workspace id from ?workspaceId= or from /workspaces/:workspaceId (and nested project routes).
 */
export function useActiveWorkspaceId() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  return useMemo(() => {
    const fromQuery = searchParams.get("workspaceId");
    if (fromQuery) return fromQuery;
    if (params.workspaceId) return params.workspaceId;
    return null;
  }, [searchParams, params.workspaceId]);
}

export function pathWithWorkspaceQuery(path, workspaceId) {
  if (!workspaceId || !WORKSPACE_SCOPED_PATHS.has(path)) return path;
  return `${path}?workspaceId=${encodeURIComponent(workspaceId)}`;
}
