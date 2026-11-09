import { makeFakeChatMessage } from "../../test/chat-fixtures";
import { emitChatRealtime } from "./realtime-state";
import { SocketChatEventPublisher } from "./socket-chat-event-publisher";

jest.mock("./realtime-state", () => ({
  emitChatRealtime: jest.fn(),
}));

describe("SocketChatEventPublisher", () => {
  test("publishMessage() emits chat:message to the network room", () => {
    new SocketChatEventPublisher().publishMessage(10, makeFakeChatMessage());
    expect(emitChatRealtime).toHaveBeenCalledWith("chat:message", 10, makeFakeChatMessage());
  });

  test("publishDeleted() emits chat:message-deleted", () => {
    new SocketChatEventPublisher().publishDeleted(null, { messageId: 5 });
    expect(emitChatRealtime).toHaveBeenCalledWith("chat:message-deleted", null, { messageId: 5 });
  });
});
