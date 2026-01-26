"use client";

import { useAdminPricingPlans, useDeleteAdminPricingPlan } from "@/features/chat/admin/pricing-plans/pricing-plan.hooks";
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

export default function AdminPricingPlansPage() {
  const { data: plans, isLoading } = useAdminPricingPlans();
  const deletePlan = useDeleteAdminPricingPlan();

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
        <h1 className="text-2xl font-bold">Pricing Plans</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.code}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>
                    <Badge variant="outline">{plan.planType}</Badge>
                </TableCell>
                <TableCell>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.monthlyPriceCents / 100)}
                </TableCell>
                 <TableCell>
                    {plan.isPopular && <Check className="h-4 w-4 text-green-500" />}
                </TableCell>
                <TableCell>
                  {plan.isActive ? (
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
                        if (confirm('Are you sure you want to delete this plan?')) {
                            deletePlan.mutate(plan.id);
                        }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {!plans?.length && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No plans found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
