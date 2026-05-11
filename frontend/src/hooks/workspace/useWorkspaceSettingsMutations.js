import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, patchData } from "../../api/axios";

export function useUpdateWorkspace(workspaceId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => patchData(`/workspaces/${workspaceId}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      qc.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace(workspaceId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteData(`/workspaces/${workspaceId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      qc.removeQueries({ queryKey: ["workspace", workspaceId] });
    },
  });
}

export function useRemoveWorkspaceMember(workspaceId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberUserId) =>
      deleteData(`/workspaces/${workspaceId}/members/${memberUserId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      qc.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useUpdateMemberRole(workspaceId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberUserId, role }) =>
      patchData(`/workspaces/${workspaceId}/members/${memberUserId}`, {
        role,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
  });
}
