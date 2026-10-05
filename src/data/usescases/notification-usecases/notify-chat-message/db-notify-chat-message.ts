import { NotifyChatMessage, NotifyChatMessageModel } from "../../../../domain/usescases/notification/notify-chat-message";
import { NotifyAccounts } from "../../../../domain/usescases/notification/notify-accounts";
import {
  LoadNetworkUnitIdsRepository,
  LoadNotificationRecipientsRepository,
} from "../../../protocols/db/notification/load-notification-recipients";

const PREVIEW_MAX_LENGTH = 120;

const buildPreview = (message: NotifyChatMessageModel): string => {
  const text = message.text?.trim();
  if (text) {
    return text.length > PREVIEW_MAX_LENGTH ? `${text.slice(0, PREVIEW_MAX_LENGTH - 1)}…` : text;
  }
  return message.hasImage ? "enviou uma imagem" : "";
};

export class DbNotifyChatMessage implements NotifyChatMessage {
  constructor(
    private readonly loadNetworkUnitIdsRepository: LoadNetworkUnitIdsRepository,
    private readonly loadNotificationRecipientsRepository: LoadNotificationRecipientsRepository,
    private readonly notifyAccounts: NotifyAccounts
  ) {}

  // Não lança: o envio da mensagem já foi concluído quando isto roda.
  async notify(message: NotifyChatMessageModel): Promise<void> {
    try {
      const excludeAccountIds = [message.senderId];
      const networkUnitIds = await this.loadNetworkUnitIdsRepository.loadNetworkUnitIds(message.unitStoreId);
      // Mesma visibilidade do chat: quem é da unidade e os admins da rede.
      const [unitMembers, networkAdmins] = await Promise.all([
        this.loadNotificationRecipientsRepository.loadRecipientIds({
          unitStoreIds: [message.unitStoreId],
          excludeAccountIds,
        }),
        this.loadNotificationRecipientsRepository.loadRecipientIds({
          roles: ["admin"],
          unitStoreIds: networkUnitIds,
          excludeAccountIds,
        }),
      ]);

      const storeLabel = message.unitStoreName || `loja ${message.unitStoreId}`;
      const preview = buildPreview(message);
      await this.notifyAccounts.notify({
        recipientIds: [...unitMembers, ...networkAdmins],
        type: "chat_message",
        title: `Nova mensagem no chat da ${storeLabel}`,
        aggregateTitle: (count) => `${count} novas mensagens no chat da ${storeLabel}`,
        body: message.senderName ? `${message.senderName}: ${preview}` : preview,
        link: "/chat",
        data: { unitStoreId: message.unitStoreId, messageId: message.messageId },
        dedupeKey: `chat:unit:${message.unitStoreId}`,
        dedupe: "aggregate",
      });
    } catch (error) {
      console.error("[notification] falha ao notificar mensagem do chat", { messageId: message.messageId, error });
    }
  }
}
