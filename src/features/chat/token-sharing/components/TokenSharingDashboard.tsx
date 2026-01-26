"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Plus, Send, Download, Info } from "lucide-react";
import { OutgoingSharesList } from "./OutgoingSharesList";
import { IncomingSharesList } from "./IncomingSharesList";
import { InviteFriendDialog } from "./InviteFriendDialog";
import { UpgradePlanPrompt } from "./UpgradePlanPrompt";
import { useTokenSharingPermission } from "../hooks/use-token-sharing-permission";

export function TokenSharingDashboard() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { canEdit, canInviteMembers } = useTokenSharingPermission();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 ">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Token Sharing</h2>
          <p className="text-muted-foreground mt-1">
            Manage tokens shared with friends or tokens you've received.
          </p>
        </div>
        
        {canInviteMembers && (
          <Button 
            onClick={() => setIsInviteOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 "
          >
            <Plus className="h-4 w-4 mr-2" />
            Share Tokens
          </Button>
        )}
      </div>

      <div className="bg-secondary/10 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <Tabs defaultValue="outgoing" className="w-full">
          <TabsList className="bg-secondary/20 p-1 mb-8">
            <TabsTrigger 
              value="outgoing" 
              className="px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              <Send className="h-4 w-4 mr-2" />
              Shared by Me
            </TabsTrigger>
            <TabsTrigger 
              value="incoming" 
              className="px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Shared with Me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outgoing" className="mt-0 outline-none">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground mb-4">
                <Info className="h-4 w-4 text-primary" />
                <span>Specify how many tokens others can use from your balance.</span>
              </div>
              {canInviteMembers ? (
                <OutgoingSharesList />
              ) : (
                <UpgradePlanPrompt />
              )}
            </div>
          </TabsContent>

          <TabsContent value="incoming" className="mt-0 outline-none">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground mb-4">
                <Info className="h-4 w-4 text-primary" />
                <span>Tokens shared with you will automatically be deducted from the sender's balance.</span>
              </div>
              <IncomingSharesList />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <InviteFriendDialog 
        open={isInviteOpen} 
        onOpenChange={setIsInviteOpen} 
      />
    </div>
  );
}
