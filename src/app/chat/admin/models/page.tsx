"use client";

import { useModels, useDeleteModel } from "@/features/chat/admin/models/model.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";

export default function AdminModelsPage() {
  const { data: models, isLoading } = useModels();
  const deleteModel = useDeleteModel();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Models</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Model
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models?.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.displayName}</TableCell>
                <TableCell>{model.providerDisplayName}</TableCell>
                <TableCell>
                  {model.isPremium ? (
                    <Badge variant="default">Premium</Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {model.enabled ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>{format(new Date(model.createdAt), "PP")}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this model?')) {
                            deleteModel.mutate(model.id);
                        }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!models?.length && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No models found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
