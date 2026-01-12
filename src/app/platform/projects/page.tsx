"use client";

import { useState } from "react";
import { Plus, FolderKanban, MoreHorizontal, Users, Key } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  EmptyState,
  SearchInput,
} from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "@/shared/hooks/use-toast";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useMemberOfProjectsQuery,
  useOwnedProjectsQuery,
  useProjectUpdateMutation,
} from "@/features/platform/projects/hooks/useProjectQueries";
import {
  CreateProjectRequest,
  ProjectResponse,
} from "@/features/platform/projects/types/projectTypes";
import { useDeleteConversationApi } from "@/features/chat/conversation/hooks/conversationHook";
import { DeleteConfirmationDialog } from "@/shared/components/delete-confirmation-dialog";
import { CreateProjectDialog } from "@/features/platform/projects/components/CreateProjectDialog";
import { EditProjectDialog } from "@/features/platform/projects/components/EditProjectDialog";
import { useSelector } from "react-redux";

export default function Projects() {
  const selectedTeam = useSelector((state: any) => state.team?.selectedTeam);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const createProject = useCreateProjectMutation();
  const deleteProject = useDeleteProjectMutation();
  const updateProject = useProjectUpdateMutation();
  const { data: ownedProjects } = useOwnedProjectsQuery();
  // const { data: memberProjects } = useMemberOfProjectsQuery();

  // const allProjects = [...(ownedProjects || []), ...(memberProjects || [])];
  const projects = Array.from(
    new Map(ownedProjects?.map((p) => [p.id, p])).values()
  );

  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = async (data: CreateProjectRequest) => {
    await createProject.mutateAsync({data : data, teamId: selectedTeam});
  };

  const handleUpdateProject = async (data: ProjectResponse) => {
    await updateProject.mutateAsync(data);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject.mutateAsync(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Projects"
          description="Manage your projects and their configurations"
        >
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </PageHeader>

        {projects?.length > 0 ? (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
              className="mb-6 max-w-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card-interactive p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <FolderKanban className="h-5 w-5 text-foreground" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-secondary rounded">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProject({ ...project });
                            setIsEditOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-medium text-foreground">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Key className="h-3.5 w-3.5" />
                      <span>
                        {Array.isArray(project?.apiKeys)
                          ? project.apiKeys.length
                          : project.apiKeys || 0}{" "}
                        keys
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {Array.isArray(project.members)
                          ? project.members.length
                          : project.members || 0}{" "}
                        members
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Last activity: {project.lastActivity}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to organize your API keys and team members."
            actionLabel="Create Project"
            onAction={() => setIsCreateOpen(true)}
          />
        )}

        <CreateProjectDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateProject}
        />

        <EditProjectDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          project={editingProject}
          onSubmit={handleUpdateProject}
        />

        <DeleteConfirmationDialog
          open={!!projectToDelete}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
