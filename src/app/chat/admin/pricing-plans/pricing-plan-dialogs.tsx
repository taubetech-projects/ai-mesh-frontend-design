"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAdminPricingPlan, useUpdateAdminPricingPlan } from "@/features/chat/admin/pricing-plans/pricing-plan.hooks";
import { PlanView, PlanType } from "@/features/chat/admin/pricing-plans/pricing-plan.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

// --- VALIDATION SCHEMAS ---

const pricingPlanSchema = z.object({
  code: z.string().min(1, "Code is required"), // e.g. PRO_MONTHLY
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  
  features: z.string().optional(), // We'll parse this from comma/newline separated string
  
  monthlyPriceCents: z.coerce.number().min(0),
  monthlyTokens: z.coerce.number().min(0),
  maxSharedInvites: z.coerce.number().min(0),
  
  roleName: z.string().min(1, "Role Name is required"),
  planType: z.enum(["PERSONAL", "BUSINESS"] as const),
  
  isPopular: z.boolean().default(false),
  badgeText: z.string().optional(),
  uiOrder: z.coerce.number().default(0),
  
  isActive: z.boolean().default(true),
});

type PricingPlanValues = z.infer<typeof pricingPlanSchema>;

// --- CREATE DIALOG ---

interface CreatePricingPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePricingPlanDialog({ open, onOpenChange }: CreatePricingPlanDialogProps) {
  const createPlan = useCreateAdminPricingPlan();
  
  const form = useForm<PricingPlanValues>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      features: "",
      monthlyPriceCents: 0,
      monthlyTokens: 0,
      maxSharedInvites: 0,
      roleName: "ROLE_USER",
      planType: "PERSONAL",
      isPopular: false,
      badgeText: "",
      uiOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = (values: PricingPlanValues) => {
    // Transform features string to array
    const featuresArray = values.features
        ? values.features.split('\n').map(f => f.trim()).filter(f => f.length > 0)
        : [];

    createPlan.mutate({
        ...values,
        features: featuresArray,
        description: values.description || "",
        badgeText: values.badgeText || undefined,
    }, {
        onSuccess: () => {
            onOpenChange(false);
            form.reset();
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Pricing Plan</DialogTitle>
          <DialogDescription>Define a new subscription tier.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                        <Input placeholder="PRO_MONTHLY" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Pro Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Plan description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-3 gap-4">
                 <FormField
                control={form.control}
                name="monthlyPriceCents"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (Cents)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>${(field.value / 100).toFixed(2)}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                  <FormField
                control={form.control}
                name="monthlyTokens"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monthly Tokens</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="maxSharedInvites"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Max Invites</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                        <Input placeholder="ROLE_PRO" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Plan Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
             </div>
            
             <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="One feature per line..." className="h-24" {...field} />
                  </FormControl>
                  <FormDescription>Enter features separated by new lines.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Popular</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                control={form.control}
                name="badgeText"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Badge Text</FormLabel>
                    <FormControl>
                        <Input placeholder="Best Value" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="uiOrder"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>UI Order</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createPlan.isPending}>
                {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Plan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// --- EDIT DIALOG ---

interface EditPricingPlanDialogProps {
  plan: PlanView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPricingPlanDialog({ plan, open, onOpenChange }: EditPricingPlanDialogProps) {
  const updatePlan = useUpdateAdminPricingPlan();
  
  const form = useForm<PricingPlanValues>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues: {
      code: plan?.code || "",
      name: plan?.name || "",
      description: plan?.description || "",
      features: plan?.features?.join('\n') || "",
      monthlyPriceCents: plan?.monthlyPriceCents || 0,
      monthlyTokens: plan?.monthlyTokens || 0,
      maxSharedInvites: plan?.maxSharedInvites || 0,
      roleName: plan?.roleName || "ROLE_USER",
      planType: plan?.planType || "PERSONAL",
      isPopular: plan?.isPopular || false,
      badgeText: plan?.badgeText || "",
      uiOrder: plan?.uiOrder || 0,
      isActive: plan?.isActive ?? true,
    },
  });

  const onSubmit = (values: PricingPlanValues) => {
    if (!plan) return;
    
    // Transform features string to array
    const featuresArray = values.features
        ? values.features.split('\n').map(f => f.trim()).filter(f => f.length > 0)
        : [];

    updatePlan.mutate({
        id: plan.id,
        data: {
            ...values,
             features: featuresArray,
             description: values.description || "",
             badgeText: values.badgeText || undefined,
        }
    }, {
        onSuccess: () => {
            onOpenChange(false);
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Pricing Plan</DialogTitle>
          <DialogDescription>Update {plan?.name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                        <Input placeholder="PRO_MONTHLY" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Pro Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Plan description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-3 gap-4">
                 <FormField
                control={form.control}
                name="monthlyPriceCents"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (Cents)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>${(field.value / 100).toFixed(2)}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                  <FormField
                control={form.control}
                name="monthlyTokens"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monthly Tokens</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="maxSharedInvites"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Max Invites</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                        <Input placeholder="ROLE_PRO" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Plan Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
             </div>

              <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="One feature per line..." className="h-24" {...field} />
                  </FormControl>
                   <FormDescription>Enter features separated by new lines.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Popular</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <FormField
                control={form.control}
                name="badgeText"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Badge Text</FormLabel>
                    <FormControl>
                        <Input placeholder="Best Value" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="uiOrder"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>UI Order</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={updatePlan.isPending}>
                {updatePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
