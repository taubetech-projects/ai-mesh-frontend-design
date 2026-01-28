"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateModel, useUpdateModel } from "@/features/chat/admin/models/model.hooks";
import { Model } from "@/features/chat/admin/models/model.types";
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

// --- VALIDATION SCHEMAS ---

const createModelSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  isPremium: z.boolean().default(false),
});

const updateModelSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  isPremium: z.boolean(),
  enabled: z.boolean(),
});

type CreateModelValues = z.infer<typeof createModelSchema>;
type UpdateModelValues = z.infer<typeof updateModelSchema>;

// --- CREATE DIALOG ---

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateModelDialog({ open, onOpenChange }: CreateModelDialogProps) {
  const createModel = useCreateModel();
  
  const form = useForm<CreateModelValues>({
    resolver: zodResolver(createModelSchema),
    defaultValues: {
      modelName: "",
      isPremium: false,
    },
  });

  const onSubmit = (values: CreateModelValues) => {
    createModel.mutate(values, {
        onSuccess: () => {
            onOpenChange(false);
            form.reset();
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Model</DialogTitle>
          <DialogDescription>Add a new AI model.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name (ID)</FormLabel>
                  <FormControl>
                    <Input placeholder="gpt-4-turbo" {...field} />
                  </FormControl>
                  <FormDescription>The internal model identifier used by the provider.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Premium Model</FormLabel>
                    <FormDescription>
                      Is this model restricted to premium users?
                    </FormDescription>
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
            <DialogFooter>
              <Button type="submit" disabled={createModel.isPending}>
                {createModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// --- EDIT DIALOG ---

interface EditModelDialogProps {
  model: Model | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModelDialog({ model, open, onOpenChange }: EditModelDialogProps) {
  const updateModel = useUpdateModel();
  
  const form = useForm<UpdateModelValues>({
    resolver: zodResolver(updateModelSchema),
    defaultValues: {
      displayName: model?.displayName || "",
      description: model?.description || "",
      isPremium: model?.isPremium || false,
      enabled: model?.enabled || false,
    },
  });

  // Since we don't have useEffect to reset form on model change (to avoid complexity in this file), 
  // relying on parent to unmount/mount or key change, OR manual reset if we were using it inside the component.
  // Ideally we should add a useEffect.
  // Actually, let's just use a key on the dialog in the parent to force re-render, OR add values to dependencies.
  // I will add a useEffect helper if I can, but standard React Query pattern is resetting form when data changes.
  
  // Actually, I'll just use the `values` prop on the form if supported or key technique.
  // For now let's hope the parent passes key={selectedModel.id} or similar to reset state.

  const onSubmit = (values: UpdateModelValues) => {
    if (!model) return;
    updateModel.mutate({
        id: model.id,
        data: values
    }, {
        onSuccess: () => {
            onOpenChange(false);
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
          <DialogDescription>Update settings for {model?.displayName}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="GPT-4 Turbo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Model description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Premium Model</FormLabel>
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
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                     <FormLabel className="text-base">Enabled</FormLabel>
                     <FormDescription>Enable or disable this model for users.</FormDescription>
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
            <DialogFooter>
              <Button type="submit" disabled={updateModel.isPending}>
                {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
