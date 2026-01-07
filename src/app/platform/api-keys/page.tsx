"use client";
import { useState } from "react";
import { Key } from "lucide-react";
import { Plus, Copy, Eye, EyeOff, Trash2, MoreHorizontal } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, DataTable, StatusBadge, EmptyState, Column } from "@/features/platform/components/platform";
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

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk-prod-xxxx...xxxx1234",
    createdAt: "2024-01-15",
    lastUsed: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "sk-dev-xxxx...xxxx5678",
    createdAt: "2024-01-10",
    lastUsed: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Test Key",
    key: "sk-test-xxxx...xxxx9012",
    createdAt: "2024-01-05",
    lastUsed: null,
    status: "revoked",
  },
];

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

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

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk-${newKeyName.toLowerCase().replace(/\s/g, "-")}-xxxx...xxxx${Math.random().toString().slice(2, 6)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: null,
      status: "active",
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setIsCreateOpen(false);
    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully.",
    });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === id ? { ...key, status: "revoked" as const } : key
      )
    );
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and can no longer be used.",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const columns: Column<ApiKey>[] = [
    {
      header: "Name",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      header: "Key",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <code className="text-sm text-muted-foreground font-mono">
            {visibleKeys.has(row.id) ? row.key.replace("xxxx...xxxx", "abcd1234efgh5678") : row.key}
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
              handleCopyKey(row.key);
            }}
            className="p-1 hover:bg-secondary rounded"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
    },
    {
      header: "Last Used",
      accessor: (row) => row.lastUsed || "Never",
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={row.status === "active" ? "Active" : "Revoked"}
          variant={row.status === "active" ? "success" : "destructive"}
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
            <DropdownMenuItem onClick={() => handleCopyKey(row.key)}>
              Copy Key
            </DropdownMenuItem>
            {row.status === "active" && (
              <DropdownMenuItem
                onClick={() => handleRevokeKey(row.id)}
                className="text-destructive"
              >
                Revoke Key
              </DropdownMenuItem>
            )}
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

        {apiKeys.length > 0 ? (
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

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access the platform. Make sure to copy it immediately as it won't be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey}>Create Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
