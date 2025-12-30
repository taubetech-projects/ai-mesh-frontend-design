import { useState } from "react";
import { Plus, FolderKanban, MoreHorizontal, Users, Key } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, EmptyState, SearchInput } from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "@/shared/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  apiKeys: number;
  members: number;
  createdAt: string;
  lastActivity: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Production App",
    description: "Main production application for customer-facing features",
    apiKeys: 3,
    members: 5,
    createdAt: "2024-01-01",
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Development",
    description: "Development and testing environment",
    apiKeys: 2,
    members: 8,
    createdAt: "2024-01-10",
    lastActivity: "30 minutes ago",
  },
  {
    id: "3",
    name: "Internal Tools",
    description: "Internal tooling and automation",
    apiKeys: 1,
    members: 3,
    createdAt: "2024-01-15",
    lastActivity: "1 day ago",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      apiKeys: 0,
      members: 1,
      createdAt: new Date().toISOString().split("T")[0],
      lastActivity: "Just now",
    };

    setProjects((prev) => [project, ...prev]);
    setNewProject({ name: "", description: "" });
    setIsCreateOpen(false);
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully.",
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been deleted.",
    });
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

        {projects.length > 0 ? (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search projects..."
              className="mb-6 max-w-md"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="card-interactive p-5"
                >
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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

                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Key className="h-3.5 w-3.5" />
                      <span>{project.apiKeys} keys</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{project.members} members</span>
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

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your API keys and collaborate with your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Production App"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Brief description of this project..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}