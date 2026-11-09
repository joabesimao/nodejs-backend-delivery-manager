import { ChatAccountNotFoundError } from "../../../domain/errors";
import { ChatStatistics } from "../../../domain/models/chat/chat-message";
import { LoadChatStatistics } from "../../../domain/usescases/chat/load-chat-statistics";
import { LoadAccountScopeRepository } from "../../protocols/db/account/load-account-scope-repository";
import { LoadChatStatisticsRepository } from "../../protocols/db/chat/load-chat-statistics-repository";

export class DbLoadChatStatistics implements LoadChatStatistics {
  constructor(
    private readonly loadAccountScopeRepository: LoadAccountScopeRepository,
    private readonly loadChatStatisticsRepository: LoadChatStatisticsRepository,
  ) {}

  async load(accountId?: number): Promise<ChatStatistics> {
    const scope = accountId ? await this.loadAccountScopeRepository.loadScope(accountId) : null;
    if (accountId && !scope) {
      throw new ChatAccountNotFoundError();
    }

    return await this.loadChatStatisticsRepository.loadStatistics(
      scope?.visibleUnitIds.length ? scope.visibleUnitIds : undefined,
    );
  }
}
