export type ThothWebhookPayload = {
	tool: string;
	guildId: string;
	ticketId?: number;
	discordUserId?: string;
	channelId?: string;
	arguments: Record<string, unknown>;
	timestamp: number;
};

/** @deprecated Use {@link ThothWebhookPayload} */
export type CustomToolWebhookPayload = ThothWebhookPayload;
