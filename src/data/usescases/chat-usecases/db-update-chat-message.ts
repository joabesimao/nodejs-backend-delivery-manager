import {
  ChatMessageNotFoundError,
  ChatPermissionDeniedError,
  InvalidChatMessageError,
} from "../../../domain/errors";
import { ChatMessage } from "../../../domain/models/chat/chat-message";
import {
  UpdateChatMessage,
  UpdateChatMessageModel,
} from "../../../domain/usescases/chat/update-chat-message";
import { LoadAccountRoleRepository } from "../../protocols/db/account/load-account-scope-repository";
import { LoadChatMessageOwnershipRepository } from "../../protocols/db/chat/load-chat-messages-repository";
import { UpdateChatMessageTextRepository } from "../../protocols/db/chat/update-chat-message-repository";

export class DbUpdateChatMessage implements UpdateChatMessage {
  constructor(
    private readonly loadChatMessageOwnershipRepository: LoadChatMessageOwnershipRepository,
    private readonly loadAccountRoleRepository: LoadAccountRoleRepository,
    private readonly updateChatMessageTextRepository: UpdateChatMessageTextRepository,
  ) {}

  async update(data: UpdateChatMessageModel): Promise<ChatMessage> {
    const message = await this.loadChatMessageOwnershipRepository.loadOwnership(data.messageId);
    if (!message) {
      throw new ChatMessageNotFoundError();
    }

    const role = await this.loadAccountRoleRepository.loadRole(data.accountId);
    const isOwner = message.senderId === data.accountId;
    const isAdmin = role === "admin";
    if (!isOwner && !isAdmin) {
      throw new ChatPermissionDeniedError("Sem permissão para editar esta mensagem");
    }

    if (!data.text && !message.imageBase64) {
      throw new InvalidChatMessageError("Mensagem não pode ficar vazia");
    }

    return await this.updateChatMessageTextRepository.updateText(data.messageId, data.text);
  }
}
