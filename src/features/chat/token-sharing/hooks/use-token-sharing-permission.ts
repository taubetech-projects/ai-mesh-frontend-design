import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

/**
 * Hook to check team-related permissions
 * Matches backend endpoint authorization requirements
 */
export function useTokenSharingPermission() {
  const { hasAuthority, me } = useChatAuth();
  console.log(me);

  return {
    // View teams tab/menu - requires teams:read
    canRead: hasAuthority("token.sharing.invitations:read"),
    
    // Create new team - requires teams:create
    canEdit: hasAuthority("token.sharing.invitations:edit"),

    // Invite team members - requires team.member.invitations:send
    canInviteMembers: hasAuthority("token.sharing.invitations:invite"),
  };
}
