"use client";

import { useAdminUsers, useDeleteAdminUser } from "@/features/chat/admin/users/user.hooks";
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

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const deleteUser = useDeleteAdminUser();

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
        <h1 className="text-2xl font-bold">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                        <Badge key={role} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant={user.userStatus === 'ACTIVE' ? 'default' : 'destructive'} className={user.userStatus === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : ''}>
                        {user.userStatus}
                    </Badge>
                </TableCell>
                <TableCell>
                    {user.twofaEnabled ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">Enabled</Badge>
                    ) : (
                         <span className="text-muted-foreground text-sm">Disabled</span>
                    )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this user?')) {
                            deleteUser.mutate(user.id);
                        }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {!users?.length && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
