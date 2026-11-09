import { ChatAccountNotFoundError } from "../../../domain/errors";
import { ChatMessagePage } from "../../../domain/models/chat/chat-message";
import {
  LoadChatMessages,
  LoadChatMessagesModel,
} from "../../../domain/usescases/chat/load-chat-messages";
import { LoadAccountScopeRepository } from "../../protocols/db/account/load-account-scope-repository";
import {
  ChatMessageFilter,
  LoadChatMessagesRepository,
} from "../../protocols/db/chat/load-chat-messages-repository";
import { toChatMessagePage } from "./chat-page";

export class DbLoadChatMessages implements LoadChatMessages {
  constructor(
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
    private readonly loadChatMessagesRepository: LoadChatMessagesRepository,
  ) {}

  async load(data: LoadChatMessagesModel): Promise<ChatMessagePage> {
    const scope = await this.loadAccountScopeRepository.loadScope(data.accountId);
    if (!scope) {
      throw new ChatAccountNotFoundError();
    }

    const filter: ChatMessageFilter = {};
    if (scope.visibleUnitIds.length) {
      filter.unitStoreIds = scope.visibleUnitIds;
    }
    if (data.unitStoreId && scope.visibleUnitIds.includes(data.unitStoreId)) {
      filter.unitStoreId = data.unitStoreId;
    }

    const { messages, total } = await this.loadChatMessagesRepository.loadPage(filter, {
      limit: data.limit,
      offset: data.offset,
    });
    return toChatMessagePage(messages, total, data.limit, data.offset);
  }
}
