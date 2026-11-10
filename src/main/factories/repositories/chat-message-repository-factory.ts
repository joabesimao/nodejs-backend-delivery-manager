import { prisma } from "../../../infra/db/prisma/client";
import { ChatMessageMysqlRepository } from "../../../infra/db/mysql/chat-message-repository/chat-message-repository";

export const makeChatMessageRepository = (): ChatMessageMysqlRepository => new ChatMessageMysqlRepository(prisma);
