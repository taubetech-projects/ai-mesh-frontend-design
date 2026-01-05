"use client";
import { useState } from "react";
import { Key } from "lucide-react";
import { Plus, Copy, Eye, EyeOff, Trash2, MoreHorizontal } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  EmptyState,
  Column,
} from "@/features/platform/components/platform";
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
import { toast } from "@/shared/hooks/use-toast";
import { RateLimitForm } from "@/features/platform/api-keys/components/RateLimitForm";
import { PermissionsForm } from "@/features/platform/api-keys/components/PermissionsForm";
import {
  useProjectApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useAllApiKeys,
  useDeleteApiKey,
} from "@/features/platform/api-keys/hooks/useProjectApiKeys";
import {
  ApiKeyCreateRequest,
  ApiKeyView,
} from "@/features/platform/api-keys/types/apiKeyTypes";
import { DeleteConfirmationDialog } from "@/shared/components/delete-confirmation-dialog";
import { useOwnedProjectsQuery } from "@/features/platform/projects/hooks/useProjectQueries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useModels } from "@/features/platform/models/hooks/useModelQueries";
import { useEndpoints } from "@/features/platform/endpoints/endpointCatalog.queries";

const AVAILABLE_MODELS = [
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo",
  "claude-3-opus",
  "claude-3-sonnet",
  "mistral-large",
  "llama-3-70b",
  "gemini-1.5-pro",
];

const AVAILABLE_ENDPOINTS = [
  "/v1/chat/completions",
  "/v1/embeddings",
  "/v1/completions",
  "/v1/models",
  "/v1/audio/transcriptions",
  "/v1/images/generations",
];

export default function ApiKeys() {
  // TODO: Get projectId from context or route param

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [rateLimits, setRateLimits] = useState({ tpm: "", rpm: "" });
  const [permissionType, setPermissionType] = useState<"all" | "restricted">(
    "all"
  );
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [selectedEndpoints, setSelectedEndpoints] = useState<Set<string>>(
    new Set()
  );
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    models?: string;
    endpoints?: string;
    projects?: string;
  }>({});

  //Here all the hooks
  const { data: apiKeys = [], isLoading } = useAllApiKeys();
  const createApiKeyMutation = useCreateApiKey(selectedProject || "");
  const updateApiKeyMutation = useUpdateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();
  const { data: ownedProjects } = useOwnedProjectsQuery();
  const { data: models } = useModels();
  const { data: endpoints } = useEndpoints();

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetForm = () => {
    setNewKeyName("");
    setRateLimits({ tpm: "", rpm: "" });
    setPermissionType("all");
    setSelectedModels(new Set());
    setSelectedEndpoints(new Set());
    setErrors({});
  };

  const handleCreateKey = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!newKeyName.trim()) {
      newErrors.name = "Key name is required";
      isValid = false;
    }

    if (!selectedProject) {
      newErrors.projects = "At least one project must be selected";
      isValid = false;
    }

    if (permissionType === "restricted") {
      if (selectedModels.size === 0) {
        newErrors.models = "At least one model must be selected";
        isValid = false;
      }
      if (selectedEndpoints.size === 0) {
        newErrors.endpoints = "At least one endpoint must be selected";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (!isValid) {
      return;
    }

    const newKeyData: ApiKeyCreateRequest = {
      name: newKeyName,
      allowAllModels: permissionType === "all",
      allowAllEndpoints: permissionType === "all",
      models: permissionType === "all" ? undefined : Array.from(selectedModels),
      endpoints:
        permissionType === "all" ? undefined : Array.from(selectedEndpoints),
      tpmLimit: rateLimits.tpm ? parseInt(rateLimits.tpm) : undefined,
      rpmLimit: rateLimits.rpm ? parseInt(rateLimits.rpm) : undefined,
    };

    console.log("New key data:", newKeyData);
    // @ts-ignore - Assuming the mutation accepts this shape based on local types
    createApiKeyMutation.mutate(newKeyData, {
      onSuccess: () => {
        resetForm();
        setIsCreateOpen(false);
      },
    });
  };

  const handleRevokeKey = (id: string) => {
    // @ts-ignore - Assuming update accepts keyId and status
    updateApiKeyMutation.mutate(
      { keyId: id, status: "revoked" },
      {
        onSuccess: () => {
          toast({
            title: "API Key Revoked",
            description:
              "The API key has been revoked and can no longer be used.",
          });
        },
      }
    );
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const handleUpdateKey = (id: string) => {
    // @ts-ignore - Assuming update accepts keyId and status
    updateApiKeyMutation.mutate(
      { keyId: id, status: "active" },
      {
        onSuccess: () => {
          toast({
            title: "API Key Activated",
            description: "The API key has been activated and can be used.",
          });
        },
      }
    );
  };

  const handleDeleteKey = (id: string) => {
    setKeyToDelete(id);
  };

  const confirmDelete = async () => {
    if (keyToDelete) {
      await deleteApiKeyMutation.mutateAsync(keyToDelete);
      setKeyToDelete(null);
    }
  };

  const columns: Column<ApiKeyView>[] = [
    {
      header: "Name",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      header: "Project Name",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.projectName}</span>
      ),
    },
    {
      header: "Key",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <code className="text-sm text-muted-foreground font-mono">
            {visibleKeys.has(row.id)
              ? row.maskedKey.replace("xxxx...xxxx", "abcd1234efgh5678")
              : row.maskedKey}
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleKeyVisibility(row.id);
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            {visibleKeys.has(row.id) ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyKey(row.maskedKey);
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ),
    },
    {
      header: "Created By",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.createdBy}</span>
      ),
    },
    {
      header: "Rate Limits",
      accessor: (row) => (
        <span className="font-medium text-foreground">
          {row.rpmLimit === null && row.tpmLimit === null
            ? "Unlimited"
            : row.rpmLimit?.toLocaleString() +
              " RPM / " +
              row.tpmLimit?.toLocaleString() +
              " TPM"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={row.active === true ? "Active" : "Revoked"}
          variant={row.active === true ? "success" : "destructive"}
        />
      ),
    },
    {
      header: "",
      accessor: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-secondary rounded">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCopyKey(row.maskedKey)}>
              Copy Key
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleKeyVisibility(row.id)}>
              Edit Key
            </DropdownMenuItem>
            {row.active === true && (
              <DropdownMenuItem
                onClick={() => handleRevokeKey(row.id)}
                className="text-destructive"
              >
                Disable Key
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleDeleteKey(row.id)}>
              Delete Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="API Keys"
          description="Manage your API keys for accessing the platform"
        >
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Key
          </Button>
        </PageHeader>

        {apiKeys.length > 0 || isLoading ? (
          <DataTable columns={columns} data={apiKeys} />
        ) : (
          <EmptyState
            icon={Key}
            title="No API keys yet"
            description="Create your first API key to start integrating with our platform."
            actionLabel="Create API Key"
            onAction={() => setIsCreateOpen(true)}
          />
        )}

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access the platform. Make sure to copy
                it immediately as it won't be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Choose a Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={(value) => {
                    setSelectedProject(value);
                    if (errors.projects) {
                      setErrors({ ...errors, projects: undefined });
                    }
                  }}
                >
                  <SelectTrigger
                    className={
                      errors.projects ? "border-destructive w-full" : "w-full"
                    }
                  >
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownedProjects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projects && (
                  <p className="text-sm text-destructive">{errors.projects}</p>
                )}
              </div>

              <RateLimitForm value={rateLimits} onChange={setRateLimits} />

              <PermissionsForm
                type={permissionType}
                onTypeChange={setPermissionType}
                selectedModels={selectedModels}
                onModelsChange={setSelectedModels}
                selectedEndpoints={selectedEndpoints}
                onEndpointsChange={setSelectedEndpoints}
                availableModels={models ?? []}
                availableEndpoints={endpoints ?? []}
                errors={errors}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateKey}
                disabled={createApiKeyMutation.isPending}
              >
                {createApiKeyMutation.isPending ? "Creating..." : "Create Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          open={!!keyToDelete}
          onOpenChange={(open) => !open && setKeyToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
