import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProjectRequest,
  ProjectResponse,
  ProjectUpdateRequest,
} from "../types/projectTypes";
import { PlatformProjectService } from "../api/platformProjectService";
import { platformProjectKeys } from "./queryKeys";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { UUID } from "../../team/team.types";

export function useOwnedProjectsQuery() {
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useQuery({
    queryKey: [...platformProjectKeys.owned(), selectedTeam?.id],
    queryFn: () => PlatformProjectService.getAll(selectedTeam?.id),
    enabled: !!selectedTeam?.id,
  });
}

export function useDeleteProjectMutation() {
  const qc = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (id: string) => {
      if (!selectedTeam?.id) throw new Error("No team selected");
      return PlatformProjectService.delete(selectedTeam.id, id);
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      qc.invalidateQueries({ queryKey: platformProjectKeys.all });
    },
  });
}

export function useProjectUpdateMutation() {
  const qc = useQueryClient();
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: (project: ProjectResponse) => {
      if (!selectedTeam?.id) throw new Error("No team selected");
      const data: ProjectUpdateRequest = {
        name: project.name,
        description: project.description,
      };
      return PlatformProjectService.update(selectedTeam.id, project.id, data);
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      qc.invalidateQueries({ queryKey: platformProjectKeys.all });
    },
  });
}

export function useMemberOfProjectsQuery() {
  return useQuery({
    queryKey: platformProjectKeys.memberOf(),
    queryFn: () => PlatformProjectService.memberOf(),
  });
}

export function useCreateProjectMutation() {
  const qc = useQueryClient();
  // const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);

  return useMutation({
    mutationFn: ({data, teamId} :{data: CreateProjectRequest, teamId: string}) => {
      // if (!selectedTeam?.id) throw new Error("No team selected");
      return PlatformProjectService.create(teamId, data);
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      qc.invalidateQueries({ queryKey: platformProjectKeys.all });
    },
  });
}
