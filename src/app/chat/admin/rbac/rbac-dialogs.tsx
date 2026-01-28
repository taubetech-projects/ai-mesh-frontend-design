"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateRole,
  useUpdateRole,
  useCreateAuthority,
  useUpdateAuthority,
} from "@/features/chat/admin/rbac/rbac.hooks";
import { RoleView, AuthorityView } from "@/features/chat/admin/rbac/rbac.types";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";

// --- VALIDATION SCHEMAS ---

const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

const updateRoleSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

const createAuthoritySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

const updateAuthoritySchema = z.object({
  description: z.string().min(1, "Description is required"),
});

type CreateRoleValues = z.infer<typeof createRoleSchema>;
type UpdateRoleValues = z.infer<typeof updateRoleSchema>;
type CreateAuthorityValues = z.infer<typeof createAuthoritySchema>;
type UpdateAuthorityValues = z.infer<typeof updateAuthoritySchema>;

// --- ROLE DIALOGS ---

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const createRole = useCreateRole();
  
  const form = useForm<CreateRoleValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: CreateRoleValues) => {
    createRole.mutate(values, {
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
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>Create a new role.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ROLE_NAME" {...field} />
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
                    <Textarea placeholder="Role description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createRole.isPending}>
                {createRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditRoleDialogProps {
    role: RoleView | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({ role, open, onOpenChange }: EditRoleDialogProps) {
    const updateRole = useUpdateRole(role?.id || "");
    
    const form = useForm<UpdateRoleValues>({
        resolver: zodResolver(updateRoleSchema),
        defaultValues: {
            description: role?.description || "",
        },
    });

    const onSubmit = (values: UpdateRoleValues) => {
        if (!role) return;
        updateRole.mutate(values, {
            onSuccess: () => onOpenChange(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update description for {role?.name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Role description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={updateRole.isPending}>
                {updateRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    )
}

// --- AUTHORITY DIALOGS ---

interface CreateAuthorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAuthorityDialog({ open, onOpenChange }: CreateAuthorityDialogProps) {
  const createAuth = useCreateAuthority();
  
  const form = useForm<CreateAuthorityValues>({
    resolver: zodResolver(createAuthoritySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: CreateAuthorityValues) => {
    createAuth.mutate(values, {
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
          <DialogTitle>Create Authority</DialogTitle>
          <DialogDescription>Create a new authority.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AUTH_NAME" {...field} />
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
                    <Textarea placeholder="Authority description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createAuth.isPending}>
                {createAuth.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditAuthorityDialogProps {
    authority: AuthorityView | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditAuthorityDialog({ authority, open, onOpenChange }: EditAuthorityDialogProps) {
    const updateAuth = useUpdateAuthority(authority?.id || "");
    
    const form = useForm<UpdateAuthorityValues>({
        resolver: zodResolver(updateAuthoritySchema),
        defaultValues: {
            description: authority?.description || "",
        },
    });

    const onSubmit = (values: UpdateAuthorityValues) => {
        if (!authority) return;
        updateAuth.mutate(values, {
            onSuccess: () => onOpenChange(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Authority</DialogTitle>
          <DialogDescription>Update description for {authority?.name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Authority description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={updateAuth.isPending}>
                {updateAuth.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    )
}
