export class ConvCreateRequest {
    title: string;
    convoType: string;
    constructor(title: string, convoType: string) { this.title = title; this.convoType = convoType;}
}

export interface ConversationResponse{
    id: number;
    externalId: string | null;
    title: string | null;
    convoType: "CHAT" | "IMAGE";
    isArchived: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface ConvUpdateRequest {
    title: string;
}
