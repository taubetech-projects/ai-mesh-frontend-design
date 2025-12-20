export const queryKey = {
  conversations: () => ["conversations"] as const,
  messages: (conversationId: number) =>
    ["conversations", conversationId, "messages"] as const,
};
