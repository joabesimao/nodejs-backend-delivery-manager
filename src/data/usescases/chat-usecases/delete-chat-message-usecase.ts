export interface DeleteChatMessageUseCaseRequest {
  messageId: number;
  accountId: number;
  accountRole: "admin" | "user";
}

export interface DeleteChatMessageUseCaseResponse {
  success: boolean;
}

export interface DeleteChatMessageUseCase {
  execute(
    request: DeleteChatMessageUseCaseRequest,
  ): Promise<DeleteChatMessageUseCaseResponse>;
}
