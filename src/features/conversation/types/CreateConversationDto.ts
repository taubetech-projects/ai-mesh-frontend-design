export class CreateConversationDto {
    title: string;
    convoType: string;
    constructor(title: string, convoType: string) { this.title = title; this.convoType = convoType;}
}