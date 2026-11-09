import { ChatAccountNotFoundError } from "../../../domain/errors";
import { ChatMessagePage } from "../../../domain/models/chat/chat-message";
import {
  SearchChatMessages,
  SearchChatMessagesModel,
} from "../../../domain/usescases/chat/search-chat-messages";
import { LoadAccountScopeRepository } from "../../protocols/db/account/load-account-scope-repository";
import {
  ChatMessageFilter,
  LoadChatMessagesRepository,
} from "../../protocols/db/chat/load-chat-messages-repository";
import { toChatMessagePage } from "./chat-page";

const endOfDay = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export class DbSearchChatMessages implements SearchChatMessages {
  constructor(
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
    private readonly loadChatMessagesRepository: LoadChatMessagesRepository,
  ) {}

  async search(data: SearchChatMessagesModel): Promise<ChatMessagePage> {
    const scope = data.accountId
      ? await this.loadAccountScopeRepository.loadScope(data.accountId)
      : null;
    if (data.accountId && !scope) {
      throw new ChatAccountNotFoundError();
    }

    const filter: ChatMessageFilter = {};
    if (scope?.visibleUnitIds.length) {
      filter.unitStoreIds = scope.visibleUnitIds;
    }
    if (data.unitStoreId && (!scope || scope.visibleUnitIds.includes(data.unitStoreId))) {
      filter.unitStoreId = data.unitStoreId;
    }
    if (data.senderId) {
      filter.senderId = data.senderId;
    }
    if (data.dateFrom) {
      filter.createdFrom = data.dateFrom;
    }
    if (data.dateTo) {
      filter.createdTo = endOfDay(data.dateTo);
    }
    if (data.hasImage) {
      filter.withImage = true;
    }
    if (data.hasText) {
      filter.withText = true;
    }
    if (data.searchText) {
      filter.searchText = data.searchText;
    }

    const { messages, total } = await this.loadChatMessagesRepository.loadPage(filter, {
      limit: data.limit,
      offset: data.offset,
    });
    return toChatMessagePage(messages, total, data.limit, data.offset);
  }
}
