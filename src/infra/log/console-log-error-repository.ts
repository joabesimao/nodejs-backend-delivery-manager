import { LogErrorRepository } from "../../data/protocols/db/register/log-error-repository";

export class ConsoleLogErrorRepository implements LogErrorRepository {
  async log(stack: string): Promise<void> {
    console.error(stack);
  }
}
