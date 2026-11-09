import { prisma } from "../../infra/db/mysql/helpers/index";
import { AccountScopeMysqlRepository } from "../../infra/db/mysql/account-scope-repository/account-scope-repository";
import { ChatMessageMysqlRepository } from "../../infra/db/mysql/chat-message-repository/chat-message-repository";

export const makeChatMessageRepository = (): ChatMessageMysqlRepository =>
  new ChatMessageMysqlRepository(prisma);

export const makeAccountScopeRepository = (): AccountScopeMysqlRepository =>
  new AccountScopeMysqlRepository(prisma);
