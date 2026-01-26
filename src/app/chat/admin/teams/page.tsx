"use client";

import {
  useAdminAllMembers,
  useAdminAllInvitations,
  useAdminRemoveMember,
  useAdminCancelInvitation,
} from "@/features/chat/admin/teams/team.admin.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { format } from "date-fns";

export default function AdminTeamsPage() {
  const { data: members, isLoading: isLoadingMembers } = useAdminAllMembers();
  const { data: invitations, isLoading: isLoadingInvitations } = useAdminAllInvitations();
  
  const removeMember = useAdminRemoveMember();
  const cancelInvitation = useAdminCancelInvitation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams Management</h1>
      </div>

        <Tabs defaultValue="members" className="w-full">
            <TabsList>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="space-y-4">
                <div className="rounded-md border bg-card">
                     {isLoadingMembers ? (
                        <div className="flex h-48 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Team ID</TableHead>
                            <TableHead>Joined At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members?.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.username}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{member.teamId}</TableCell>
                                <TableCell>{format(new Date(member.joinedAt), "PP")}</TableCell>
                                <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to remove this member?')) {
                                            removeMember.mutate(member.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                            {!members?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No members found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    )}
                </div>
            </TabsContent>
            
            <TabsContent value="invitations" className="space-y-4">
                  <div className="rounded-md border bg-card">
                     {isLoadingInvitations ? (
                        <div className="flex h-48 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Team ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invitations?.map((invitation) => (
                            <TableRow key={invitation.id}>
                                <TableCell className="font-medium">{invitation.email}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{invitation.teamId}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{invitation.status}</Badge>
                                </TableCell>
                                <TableCell>{format(new Date(invitation.expiresAt), "PP")}</TableCell>
                                <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to cancel this invitation?')) {
                                            cancelInvitation.mutate(invitation.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                             {!invitations?.length && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No invitations found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
