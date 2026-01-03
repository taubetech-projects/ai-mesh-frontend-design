import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProjectRequest,
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/projectTypes";
import { PlatformProjectService } from "../api/platformProjectService";
import { projectKeys } from "./queryKeys";
import { toast } from "sonner";

export function useOwnedProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.owned(),
    queryFn: () => PlatformProjectService.owned(),
  });
}

export function useDeleteProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PlatformProjectService.delete(id),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useProjectUpdateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (project: ProjectResponse) => {
      const data: ProjectUpdateRequest = { name: project.name, description: project.description };
      return PlatformProjectService.update(project.id, data)
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useMemberOfProjectsQuery() {
  return useQuery({
    queryKey: projectKeys.memberOf(),
    queryFn: () => PlatformProjectService.memberOf(),
  });
}

export function useCreateProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      PlatformProjectService.create(data),
    onSuccess: () => {
      toast.success("Project created successfully!");
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
