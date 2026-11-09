import {
  ChatAccountNotFoundError,
  ChatPermissionDeniedError,
  InvalidChatMessageError,
} from "../../../domain/errors";
import { ChatMessage } from "../../../domain/models/chat/chat-message";
import { AddChatMessage, AddChatMessageModel } from "../../../domain/usescases/chat/add-chat-message";
import { NotifyChatMessage } from "../../../domain/usescases/notification/notify-chat-message";
import { LoadAccountScopeRepository } from "../../protocols/db/account/load-account-scope-repository";
import { AddChatMessageRepository } from "../../protocols/db/chat/add-chat-message-repository";
import { ChatEventPublisher } from "../../protocols/realtime/chat-event-publisher";
import { MAX_CHAT_IMAGE_SIZE_BYTES, estimateBase64Bytes, normalizeBase64 } from "./chat-image";

export class DbAddChatMessage implements AddChatMessage {
  constructor(
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
    private readonly addChatMessageRepository: AddChatMessageRepository,
    private readonly chatEventPublisher: ChatEventPublisher,
    private readonly notifyChatMessage: NotifyChatMessage,
  ) {}

  async add(data: AddChatMessageModel): Promise<ChatMessage> {
    const scope = await this.loadAccountScopeRepository.loadScope(data.accountId);
    if (!scope) {
      throw new ChatAccountNotFoundError();
    }

    let unitStoreId = data.unitStoreId || 0;
    if (!unitStoreId) {
      if (scope.visibleUnitIds.length === 0) {
        throw new ChatPermissionDeniedError("Sem permissão para enviar para nenhuma loja");
      }
      unitStoreId = scope.visibleUnitIds[0];
    }

    if (!scope.visibleUnitIds.includes(unitStoreId)) {
      throw new ChatPermissionDeniedError("Sem permissão para enviar para essa loja");
    }

    const imageBase64 = data.imageBase64 ? normalizeBase64(data.imageBase64) : null;
    if (imageBase64 && estimateBase64Bytes(imageBase64) > MAX_CHAT_IMAGE_SIZE_BYTES) {
      throw new InvalidChatMessageError("Imagem excede o tamanho máximo de 5MB");
    }

    const message = await this.addChatMessageRepository.add({
      unitStoreId,
      senderId: data.accountId,
      text: data.text || null,
      imageBase64,
      imageMimeType: data.imageMimeType || null,
    });

    this.chatEventPublisher.publishMessage(scope.rootStoreId, message);
    void this.notifyChatMessage.notify({
      messageId: message.id,
      unitStoreId: message.unitStoreId,
      unitStoreName: message.unitStore?.name,
      senderId: message.senderId,
      senderName: message.sender?.name,
      text: message.text,
      hasImage: Boolean(message.imageBase64),
    });

    return message;
  }
}
