import { ChatMessageNotFoundError, ChatPermissionDeniedError } from "../../../domain/errors";
import { DeleteChatMessage } from "../../../domain/usescases/chat/delete-chat-message";
import {
  LoadAccountRoleRepository,
  LoadAccountScopeRepository,
} from "../../protocols/db/account/load-account-scope-repository";
import { DeleteChatMessageRepository } from "../../protocols/db/chat/delete-chat-message-repository";
import { LoadChatMessageOwnershipRepository } from "../../protocols/db/chat/load-chat-messages-repository";
import { ChatEventPublisher } from "../../protocols/realtime/chat-event-publisher";

export class DbDeleteChatMessage implements DeleteChatMessage {
  constructor(
    private readonly loadChatMessageOwnershipRepository: LoadChatMessageOwnershipRepository,
    private readonly loadAccountRoleRepository: LoadAccountRoleRepository,
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
    private readonly deleteChatMessageRepository: DeleteChatMessageRepository,
    private readonly chatEventPublisher: ChatEventPublisher,
  ) {}

  async delete(messageId: number, accountId: number): Promise<void> {
    const message = await this.loadChatMessageOwnershipRepository.loadOwnership(messageId);
    if (!message) {
      throw new ChatMessageNotFoundError();
    }

    const role = await this.loadAccountRoleRepository.loadRole(accountId);
    const isOwner = message.senderId === accountId;
    const isAdmin = role === "admin";

    const scope = await this.loadAccountScopeRepository.loadScope(accountId);
    const outOfScope =
      !!scope &&
      scope.visibleUnitIds.length > 0 &&
      !scope.visibleUnitIds.includes(message.unitStoreId);

    if ((!isOwner && !isAdmin) || outOfScope) {
      throw new ChatPermissionDeniedError("Sem permissão para deletar esta mensagem");
    }

    await this.deleteChatMessageRepository.deleteById(messageId);
    this.chatEventPublisher.publishDeleted(scope?.rootStoreId ?? null, { messageId });
  }
}
