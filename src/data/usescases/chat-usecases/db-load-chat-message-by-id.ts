import { ChatMessageNotFoundError, ChatPermissionDeniedError } from "../../../domain/errors";
import { ChatMessage } from "../../../domain/models/chat/chat-message";
import { LoadChatMessageById } from "../../../domain/usescases/chat/load-chat-message-by-id";
import { LoadAccountScopeRepository } from "../../protocols/db/account/load-account-scope-repository";
import { LoadChatMessageByIdRepository } from "../../protocols/db/chat/load-chat-messages-repository";

export class DbLoadChatMessageById implements LoadChatMessageById {
  constructor(
    private readonly loadChatMessageByIdRepository: LoadChatMessageByIdRepository,
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
  ) {}

  async loadById(messageId: number, accountId: number): Promise<ChatMessage> {
    const message = await this.loadChatMessageByIdRepository.loadById(messageId);
    if (!message) {
      throw new ChatMessageNotFoundError();
    }

    const scope = await this.loadAccountScopeRepository.loadScope(accountId);
    if (!scope || !scope.visibleUnitIds.includes(message.unitStoreId)) {
      throw new ChatPermissionDeniedError("Sem permissão para acessar essa mensagem");
    }

    return message;
  }
}
