"use client";

import { useRoles, useAuthorities, useDeleteRole, useDeleteAuthority } from "@/features/chat/admin/rbac/rbac.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { AuthorityView, RoleView } from "@/features/chat/admin/rbac/rbac.types";
import { useState } from "react";
import { 
    CreateRoleDialog, 
    EditRoleDialog, 
    CreateAuthorityDialog, 
    EditAuthorityDialog 
} from "./rbac-dialogs";

export default function AdminRbacPage() {
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: authorities , isLoading: isLoadingAuthorities } = useAuthorities();

  const deleteRole = useDeleteRole();
  const deleteAuthority = useDeleteAuthority();
  
  // ROLE STATE
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleView | null>(null);

  // AUTHORITY STATE
  const [isCreateAuthOpen, setIsCreateAuthOpen] = useState(false);
  const [isEditAuthOpen, setIsEditAuthOpen] = useState(false);
  const [selectedAuth, setSelectedAuth] = useState<AuthorityView | null>(null);

  const handleEditRole = (role: RoleView) => {
    setSelectedRole(role);
    setIsEditRoleOpen(true);
  };

  const handleEditAuth = (auth: AuthorityView) => {
    setSelectedAuth(auth);
    setIsEditAuthOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">RBAC Management</h1>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="authorities">Authorities</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
             <div className="flex justify-end">
                <Button onClick={() => setIsCreateRoleOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
            </div>
            <div className="rounded-md border bg-card">
                 {isLoadingRoles ? (
                    <div className="flex h-48 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                 ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles?.map((role: any) => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>{role.description}</TableCell>
                            <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditRole(role)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this role?')) {
                                        deleteRole.mutate(role.id);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                         {!roles?.length && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No roles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                 )}
            </div>
        </TabsContent>

        <TabsContent value="authorities" className="space-y-4">
             <div className="flex justify-end">
                <Button onClick={() => setIsCreateAuthOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Authority
                </Button>
            </div>
             <div className="rounded-md border bg-card">
                 {isLoadingAuthorities ? (
                    <div className="flex h-48 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                 ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Authority Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {authorities?.map((auth: AuthorityView) => (
                        <TableRow key={auth.id}>
                            <TableCell className="font-medium">{auth.name}</TableCell>
                            <TableCell>{auth.description}</TableCell>
                            <TableCell className="text-right">
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditAuth(auth)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this authority?')) {
                                        deleteAuthority.mutate(auth.id);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                        {!authorities?.length && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No authorities found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                 )}
            </div>
        </TabsContent>
      </Tabs>
      
      <CreateRoleDialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen} />
      <EditRoleDialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen} role={selectedRole} />
      
      <CreateAuthorityDialog open={isCreateAuthOpen} onOpenChange={setIsCreateAuthOpen} />
      <EditAuthorityDialog open={isEditAuthOpen} onOpenChange={setIsEditAuthOpen} authority={selectedAuth} />
    </div>
  );
}
