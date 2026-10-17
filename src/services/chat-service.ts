import ActionType from "#/types/action-type";

export function createChatMessage(
  message: string,
  image_urls: string[],
  file_urls: string[],
  timestamp: string,
  clientMessageId?: string,
) {
  const event = {
    action: ActionType.MESSAGE,
    args: {
      content: message,
      image_urls,
      file_urls,
      timestamp,
      ...(clientMessageId ? { client_message_id: clientMessageId } : {}),
    },
  };
  return event;
}
