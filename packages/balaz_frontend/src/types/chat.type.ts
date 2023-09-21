export interface GroupChatMessages {
    senderId: string;
    username: string;
    timestamp: Date;
    content: string;
}

export interface GroupChat {
    messages: GroupChatMessages[];
    created_at: Date;
    updated_at: Date;
}