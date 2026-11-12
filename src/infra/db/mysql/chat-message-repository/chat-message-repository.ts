import { Prisma, PrismaClient } from "@prisma/client";
import {
  AddChatMessageRepository,
  AddChatMessageRepositoryModel,
} from "../../../../data/protocols/db/chat/add-chat-message-repository";
import { DeleteChatMessageRepository } from "../../../../data/protocols/db/chat/delete-chat-message-repository";
import { LoadChatStatisticsRepository } from "../../../../data/protocols/db/chat/load-chat-statistics-repository";
import {
  ChatMessageFilter,
  ChatMessageOwnership,
  ChatMessagePageQuery,
  LoadChatMessageByIdRepository,
  LoadChatMessageOwnershipRepository,
  LoadChatMessagesRepository,
  LoadLatestChatMessagesRepository,
} from "../../../../data/protocols/db/chat/load-chat-messages-repository";
import { UpdateChatMessageTextRepository } from "../../../../data/protocols/db/chat/update-chat-message-repository";
import { ChatMessage, ChatStatistics } from "../../../../domain/models/chat/chat-message";

const CHAT_MESSAGE_INCLUDE = {
  sender: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      unitStoreId: true,
    },
  },
  unitStore: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

const buildWhere = (filter: ChatMessageFilter): Prisma.ChatMessageWhereInput => {
  const where: Prisma.ChatMessageWhereInput = {};

  if (filter.unitStoreIds) {
    where.unitStoreId = { in: filter.unitStoreIds };
  }
  if (filter.unitStoreId) {
    where.unitStoreId = filter.unitStoreId;
  }
  if (filter.senderId) {
    where.senderId = filter.senderId;
  }
  if (filter.createdFrom || filter.createdTo) {
    where.createdAt = {
      ...(filter.createdFrom && { gte: filter.createdFrom }),
      ...(filter.createdTo && { lte: filter.createdTo }),
    };
  }
  if (filter.withImage) {
    where.imageBase64 = { not: null };
  }
  if (filter.withText) {
    where.text = { not: null };
  }
  if (filter.searchText) {
    const contains = { contains: filter.searchText, mode: "insensitive" as const };
    where.OR = [
      { text: contains },
      { sender: { name: contains } },
      { unitStore: { name: contains } },
    ];
  }

  return where;
};

export class ChatMessageMysqlRepository
  implements
    AddChatMessageRepository,
    LoadChatMessagesRepository,
    LoadLatestChatMessagesRepository,
    LoadChatMessageByIdRepository,
    LoadChatMessageOwnershipRepository,
    UpdateChatMessageTextRepository,
    DeleteChatMessageRepository,
    LoadChatStatisticsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(data: AddChatMessageRepositoryModel): Promise<ChatMessage> {
    return await this.prisma.chatMessage.create({
      data,
      include: CHAT_MESSAGE_INCLUDE,
    });
  }

  async loadPage(
    filter: ChatMessageFilter,
    page: ChatMessagePageQuery,
  ): Promise<{ messages: ChatMessage[]; total: number }> {
    const where = buildWhere(filter);
    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where,
        include: CHAT_MESSAGE_INCLUDE,
        orderBy: { createdAt: "desc" },
        take: page.limit,
        skip: page.offset,
      }),
      this.prisma.chatMessage.count({ where }),
    ]);
    return { messages, total };
  }

  async loadLatest(unitStoreIds: number[], limit: number): Promise<ChatMessage[]> {
    return await this.prisma.chatMessage.findMany({
      where: unitStoreIds.length ? { unitStoreId: { in: unitStoreIds } } : undefined,
      include: CHAT_MESSAGE_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async loadById(id: number): Promise<ChatMessage | null> {
    return await this.prisma.chatMessage.findUnique({
      where: { id },
      include: CHAT_MESSAGE_INCLUDE,
    });
  }

  async loadOwnership(id: number): Promise<ChatMessageOwnership | null> {
    return await this.prisma.chatMessage.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, role: true },
        },
      },
    });
  }

  async updateText(id: number, text: string | null): Promise<ChatMessage> {
    return await this.prisma.chatMessage.update({
      where: { id },
      data: { text },
      include: CHAT_MESSAGE_INCLUDE,
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.chatMessage.delete({
      where: { id },
    });
  }

  async loadStatistics(unitStoreIds?: number[]): Promise<ChatStatistics> {
    const where = unitStoreIds ? { unitStoreId: { in: unitStoreIds } } : undefined;

    const totalMessages = await this.prisma.chatMessage.count({ where });
    const messagesWithImages = await this.prisma.chatMessage.count({
      where: { ...where, imageBase64: { not: null } },
    });
    const messagesWithText = await this.prisma.chatMessage.count({
      where: { ...where, text: { not: null } },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const messagesToday = await this.prisma.chatMessage.count({
      where: { ...where, createdAt: { gte: today, lt: tomorrow } },
    });

    const uniqueSenders = await this.prisma.chatMessage.findMany({
      where,
      select: { senderId: true },
      distinct: ["senderId"],
    });

    const activeUnits = await this.prisma.chatMessage.findMany({
      where,
      select: { unitStoreId: true },
      distinct: ["unitStoreId"],
    });

    const lastMessage = await this.prisma.chatMessage.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { name: true } },
        unitStore: { select: { name: true } },
      },
    });

    const messagesByHour: ChatStatistics["messagesByHour"] = [];
    for (let hour = 23; hour >= 0; hour--) {
      const hourStart = new Date();
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date();
      hourEnd.setHours(hour + 1, 0, 0, 0);

      const count = await this.prisma.chatMessage.count({
        where: { ...where, createdAt: { gte: hourStart, lt: hourEnd } },
      });
      messagesByHour.push({ hour, count });
    }

    return {
      totalMessages,
      messagesWithImages,
      messagesWithText,
      messagesToday,
      uniqueSenders: uniqueSenders.length,
      activeUnits: activeUnits.length,
      lastMessage: lastMessage
        ? {
            id: lastMessage.id,
            text: lastMessage.text,
            sender: lastMessage.sender.name,
            unit: lastMessage.unitStore.name,
            createdAt: lastMessage.createdAt,
          }
        : null,
      messagesByHour,
    };
  }
}
