import type {
  MessagePage,
  MessagePartRequest,
} from "@/features/chat/types/models"; // adjust
import { MESSAGE_PART_TYPES, EMPTY_STRING } from "@/shared/constants/constants"; // adjust

export const ensurePage = (old?: MessagePage | unknown): MessagePage =>
  (old as MessagePage) ?? { messages: [], nextCursor: null };

export const normalizePartsWithText = (
  parts: any[] | undefined,
  nextText: string
) => {
  const firstPart =
    (parts?.[0] as MessagePartRequest) ??
    ({ type: MESSAGE_PART_TYPES.TEXT, text: EMPTY_STRING } as any);

  const restParts: MessagePartRequest[] = (parts?.slice(1) ?? []).map((p) => ({
    ...(p as any),
    type: (p as any)?.type ?? MESSAGE_PART_TYPES.TEXT,
  }));

  const newParts: MessagePartRequest[] = [
    { ...firstPart, type: MESSAGE_PART_TYPES.TEXT, text: nextText },
    ...restParts,
  ];

  return newParts;
};
