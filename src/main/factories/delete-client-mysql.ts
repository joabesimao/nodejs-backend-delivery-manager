import { DeleteClientController } from "../../presentation/controllers/client-controllers/delete-client/delete-client";
import { DbDeleteClient } from "../../data/usescases/client-usecases/delete-client/db-delete-client";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddRegisterValidation } from "./add-register-validation";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteClientController = (): Controller => {
  const deleteClientRepository = new ClientMysqlRepository(prisma);
  const deleteClient = new DbDeleteClient(deleteClientRepository);
  const deleteClientController = new DeleteClientController(deleteClient);

  return deleteClientController;
};
