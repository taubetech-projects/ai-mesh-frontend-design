import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

/**
 * Hook to check team-related permissions
 * Matches backend endpoint authorization requirements
 */
export function useTeamPermissions() {
  const { hasAuthority, me } = useChatAuth();
  console.log(me);

  return {
    // View teams tab/menu - requires teams:read
    canViewTeams: hasAuthority("teams:read"),
    
    // Create new team - requires teams:create
    canCreateTeam: hasAuthority("teams:create"),
    
    // Update team name - requires teams:update
    canUpdateTeam: hasAuthority("teams:update"),
    
    // Delete team - requires teams:delete
    canDeleteTeam: hasAuthority("teams:delete"),
    
    // Invite team members - requires team.member.invitations:send
    canInviteMembers: hasAuthority("team.member.invitations:send"),
  };
}
