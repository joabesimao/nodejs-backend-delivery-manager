// Protocolo de use case para deletar mensagem de chat
import { Either } from "../../../domain/models/either";

export interface DeleteChatMessageUseCaseRequest {
  messageId: number;
  accountId: number;
  accountRole: "principal" | "branch";
}

export interface DeleteChatMessageUseCaseResponse {
  success: boolean;
}

export interface DeleteChatMessageUseCase {
  execute(
    request: DeleteChatMessageUseCaseRequest,
  ): Promise<Either<Error, DeleteChatMessageUseCaseResponse>>;
}
