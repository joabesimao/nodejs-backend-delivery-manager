import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadChatMessagesController } from "../factories/load-chat-messages";
import { makeLoadChatMessageByIdController } from "../factories/load-chat-message-by-id";
import { makeAddChatMessageController } from "../factories/add-chat-message";
import { makeDeleteChatMessageController } from "../factories/delete-chat-message";
import { makeUpdateChatMessageController } from "../factories/update-chat-message";
import { makeSearchChatMessagesController } from "../factories/search-chat-messages";
import { makeGetChatStatisticsController } from "../factories/get-chat-statistics";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/chat/messages",
    auth(),
    adaptRoute(makeLoadChatMessagesController()),
  );
  router.get(
    "/chat/search",
    auth(),
    adaptRoute(makeSearchChatMessagesController()),
  );
  router.get(
    "/chat/messages/:id",
    auth(),
    adaptRoute(makeLoadChatMessageByIdController()),
  );
  router.post(
    "/chat/messages",
    auth(),
    adaptRoute(makeAddChatMessageController()),
  );
  router.put(
    "/chat/messages/:id",
    auth(),
    adaptRoute(makeUpdateChatMessageController()),
  );
  router.delete(
    "/chat/messages/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteChatMessageController()),
  );
  router.get(
    "/chat/statistics",
    auth(),
    adaptRoute(makeGetChatStatisticsController()),
  );
};
