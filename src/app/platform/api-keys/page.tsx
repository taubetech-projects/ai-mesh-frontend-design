"use client";
import { useState } from "react";
import { Key } from "lucide-react";
import {
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/hooks/use-toast";
import { RateLimitForm } from "@/features/platform/api-keys/components/RateLimitForm";
import { PermissionsForm } from "@/features/platform/api-keys/components/PermissionsForm";
import {
  useProjectApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  useRevokeApiKey,
  useSearchApiKeys,
} from "@/features/platform/api-keys/hooks/useProjectApiKeys";
import {
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyUpdateRequest,
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
import { set } from "date-fns";
import { ApiKeySuccess } from "@/features/platform/api-keys/components/ApiKeySuccess";

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
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [filterProject, setFilterProject] = useState<string | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);


  //Here all the hooks
  const createApiKeyMutation = useCreateApiKey(selectedProject || "");
  const updateApiKeyMutation = useUpdateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();
  const revokeApiKeyMutation = useRevokeApiKey();

  const { data: ownedProjects } = useOwnedProjectsQuery();
  const { data: models } = useModels();
  const { data: endpoints } = useEndpoints();
  const { data: apiKeys = [], isLoading } = useSearchApiKeys(
    searchName || null,
    filterProject || null,
    filterStatus === "active" ? true : filterStatus === "revoked" ? false : null
  );

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
    setCreatedApiKey(null);
    setNewKeyName("");
    setRateLimits({ tpm: "", rpm: "" });
    setPermissionType("all");
    setSelectedModels(new Set());
    setSelectedEndpoints(new Set());
    setErrors({});
    setEditingKeyId(null);
    setSelectedProject(undefined);
  };

  const handleApiKeySuccessOnClose = () => {
    resetForm();
    setIsCreateOpen(false);
  };

  const handleSaveKey = async () => {
    const newErrors: typeof errors = {};
    let isValid = true;
    console.log("selectedProject", selectedProject);

    if (!newKeyName.trim()) {
      newErrors.name = "Key name is required";
      isValid = false;
    }

    if (!selectedProject && showProjects) {
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
    console.log("editingKeyId", editingKeyId);
    if (editingKeyId) {
      const updateBody: ApiKeyUpdateRequest = {
        name: newKeyName,
        allowAllModels: permissionType === "all",
        allowAllEndpoints: permissionType === "all",
        models:
          permissionType === "all" ? undefined : Array.from(selectedModels),
        endpoints:
          permissionType === "all" ? undefined : Array.from(selectedEndpoints),
        tpmLimit: rateLimits.tpm ? parseInt(rateLimits.tpm) : undefined,
        rpmLimit: rateLimits.rpm ? parseInt(rateLimits.rpm) : undefined,
      };
      console.log("updateBody", updateBody);
      updateApiKeyMutation.mutate(
        { body: updateBody, keyId: editingKeyId },
        {
          onSuccess: () => {
            resetForm();
            setIsCreateOpen(false);
            toast({
              title: "API Key Updated",
              description: "The API key has been successfully updated.",
            });
          },
        }
      );
    } else {
      // @ts-ignore - Assuming the mutation accepts this shape based on local types
      const apiKey = await createApiKeyMutation.mutateAsync(newKeyData);
      resetForm();
      setCreatedApiKey(apiKey.apiKey);
    }
  };

  const handleRevokeKey = () => {
    if (keyToRevoke) {
      revokeApiKeyMutation.mutate(
        { keyId: keyToRevoke },
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
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const handleEditClick = (key: ApiKeyView) => {
    console.log("selected endpoints", selectedEndpoints);
    setEditingKeyId(key.id);
    setNewKeyName(key.name);
    setShowProjects(false);
    setRateLimits({
      tpm: key.tpmLimit ? key.tpmLimit.toString() : "",
      rpm: key.rpmLimit ? key.rpmLimit.toString() : "",
    });

    if (key.allowAllModels && key.allowAllEndpoints) {
      setPermissionType("all");
      setSelectedModels(new Set());
      setSelectedEndpoints(new Set());
    } else {
      setPermissionType("restricted");

      const modelIds = new Set<string>();
      if (key.models && models) {
        key.models.forEach((name) => {
          const model = models.find((m) => m.name === name);
          if (model) modelIds.add(model.id);
        });
      }
      setSelectedModels(modelIds);
      console.log("Current key endpoints :", key.endpoints);
      console.log("Endpoints: ", endpoints);
      const endpointIds = new Set<string>();
      const currentEndpoints = Array.isArray(key.endpoints)
        ? key.endpoints
        : String(key.endpoints || "").split(",");

      if (endpoints) {
        currentEndpoints.forEach((name) => {
          const endpoint = endpoints.find((e) => e.code === name);
          if (endpoint) endpointIds.add(endpoint.id);
        });
      }
      setSelectedEndpoints(endpointIds);
    }
    setIsCreateOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateOpen(true);
    setShowProjects(true);
    // resetForm();
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
        </div>
      ),
    },

    {
      header: "Allowed Models",
      accessor: (row) => (
        <div className="font-medium text-foreground whitespace-normal break-words">
          {row.allowAllModels === true ? "All" : row.models?.join(", ")}
        </div>
      ),
      className: "w-50",
    },

    {
      header: "Allowed Endpoints",
      accessor: (row) => (
        <span className="font-medium text-foreground">
          {row.allowAllEndpoints === true && row.endpoints?.length === 0
            ? "All"
            : row.endpoints?.join(", ")}
        </span>
      ),
      className: "w-50",
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
            <DropdownMenuItem onClick={() => handleEditClick(row)}>
              Edit Key
            </DropdownMenuItem>
            {row.active === true && (
              <DropdownMenuItem onClick={() => setKeyToRevoke(row.id)}>
                Revoke Key
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleDeleteKey(row.id)}
              className="text-destructive"
            >
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
          <Button onClick={() => handleCreateClick()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Key
          </Button>
        </PageHeader>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search API keys..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-8"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(filterProject || filterStatus) && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {(filterProject ? 1 : 0) + (filterStatus ? 1 : 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Refine your API keys list
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Project</Label>
                  <Select
                    value={filterProject || "all"}
                    onValueChange={(value) =>
                      setFilterProject(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {ownedProjects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={filterStatus || "all"}
                    onValueChange={(value) =>
                      setFilterStatus(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(filterProject || filterStatus) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFilterProject(undefined);
                      setFilterStatus(undefined);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {apiKeys.length > 0 ||
        isLoading ||
        searchName ||
        filterProject ||
        filterStatus ? (
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
          <DialogContent className="sm:max-w-[700px]">
            {createdApiKey ? (
              <ApiKeySuccess apiKey={createdApiKey} onClose={handleApiKeySuccessOnClose} />
            ) : (
              <>
            <DialogHeader>
              <DialogTitle>
                {editingKeyId ? "Edit API Key" : "Create API Key"}
              </DialogTitle>
              <DialogDescription>
                {editingKeyId
                  ? "Update the details of your API key."
                  : "Create a new API key to access the platform. Make sure to copy it immediately as it won't be shown again."}
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
              {showProjects && (
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
                    <p className="text-sm text-destructive">
                      {errors.projects}
                    </p>
                  )}
                </div>
              )}

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
                onClick={handleSaveKey}
                disabled={
                  createApiKeyMutation.isPending ||
                  updateApiKeyMutation.isPending
                }
              >
                {createApiKeyMutation.isPending ||
                updateApiKeyMutation.isPending
                  ? "Saving..."
                  : editingKeyId
                  ? "Save Changes"
                  : "Create Key"}
              </Button>
            </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          open={!!keyToDelete}
          onOpenChange={(open) => !open && setKeyToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
        />

        <DeleteConfirmationDialog
          open={!!keyToRevoke}
          onOpenChange={(open) => !open && setKeyToRevoke(null)}
          onConfirm={handleRevokeKey}
          title="Revoke Key"
          description="Are you sure you want to revoke this key? This action cannot be undone."
          confirmText="Confirm"
        />
      </div>
    </DashboardLayout>
  );
}
