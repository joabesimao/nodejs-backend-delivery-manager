// Protocolo de use case para salvar mensagem de chat
import { Either } from "../../../domain/models/either";

export interface SaveChatMessageUseCaseRequest {
  unitStoreId: number;
  senderId: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
}

export interface SaveChatMessageUseCaseResponse {
  id: number;
  unitStoreId: number;
  senderId: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
  createdAt: Date;
}

export interface SaveChatMessageUseCase {
  execute(
    request: SaveChatMessageUseCaseRequest,
  ): Promise<Either<Error, SaveChatMessageUseCaseResponse>>;
}
