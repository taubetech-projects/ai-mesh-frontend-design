"use client";

import { usePlanBillingOptions, useDeletePlanBillingOption } from "@/features/chat/admin/plan-billing-options/plan-billing-hooks.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export default function AdminPlanBillingOptionsPage() {
  const { data: options, isLoading } = usePlanBillingOptions();
  const deleteOption = useDeletePlanBillingOption();

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
        <h1 className="text-2xl font-bold">Plan Billing Options</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Option
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options?.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium">{option.provider}</TableCell>
                <TableCell>{option.kind}</TableCell>
                <TableCell>
                    {option.interval || '-'}
                </TableCell>
                <TableCell>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: option.currency }).format(option.amountCents / 100)}
                </TableCell>
                <TableCell>
                  {option.isActive ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this billing option?')) {
                            deleteOption.mutate(option.id);
                        }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {!options?.length && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No billing options found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
