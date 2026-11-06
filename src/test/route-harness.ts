import { JwtAdapter } from "../infra/cryptography/jwt-adapter/jwt-adapter";
import { env } from "../../config/Env";

type MockModel = Record<string, jest.Mock>;
export type PrismaMock = Record<string, MockModel>;

/**
 * Cria um PrismaClient falso para os testes de rota.
 * Qualquer `prisma.<model>.<method>` acessado vira um `jest.fn()` estável, criado
 * na primeira leitura. Assim o app inteiro sobe sem banco e cada teste configura
 * só as queries que a rota usa.
 */
export const createPrismaMock = (): PrismaMock => {
  const models = new Map<string, MockModel>();

  const makeModel = (): MockModel =>
    new Proxy<MockModel>(
      {},
      {
        get: (target, method) => {
          if (typeof method !== "string" || method === "then") return undefined;
          target[method] ??= jest.fn();
          return target[method];
        },
      },
    );

  return new Proxy<PrismaMock>(
    {},
    {
      get: (_target, model) => {
        if (typeof model !== "string" || model === "then") return undefined;
        if (!models.has(model)) models.set(model, makeModel());
        return models.get(model);
      },
    },
  );
};

export const makeAccessToken = async (accountId: number): Promise<string> =>
  await new JwtAdapter(env.JWT_SECRET).encrypt(String(accountId), {
    type: "access",
  });

export interface FakeAccount {
  id: number;
  role: "admin" | "gerente_estoque" | "entregador" | "user";
  unitStoreId: number | null;
}

export const makeFakeAccount = (overrides: Partial<FakeAccount> = {}) => ({
  id: 1,
  name: "Conta Teste",
  email: "conta@teste.com",
  password: "hashed",
  role: "admin" as FakeAccount["role"],
  active: true,
  unitStoreId: null as number | null,
  ...overrides,
});

/**
 * Faz o `prisma.account.findUnique` responder pela conta autenticada. Ele é usado
 * tanto pelo auth middleware quanto pelo `getAccountScope`.
 */
export const mockAuthenticatedAccount = (
  prisma: PrismaMock,
  account: ReturnType<typeof makeFakeAccount>,
): void => {
  prisma.account.findUnique.mockImplementation(
    async (args: { where: { id: number } }) =>
      args?.where?.id === account.id ? account : null,
  );
};

/**
 * Árvore de lojas: `parentStoreId` por id. Faz o `getAccountScope` resolver a
 * raiz e os descendentes como no banco.
 */
export const mockUnitStoreTree = (
  prisma: PrismaMock,
  tree: Record<number, number | null>,
): void => {
  prisma.unitStore.findUnique.mockImplementation(
    async (args: { where: { id: number } }) => {
      const id = args.where.id;
      return id in tree ? { id, parentStoreId: tree[id] } : null;
    },
  );
  prisma.unitStore.findMany.mockImplementation(
    async (args: { where: { parentStoreId: number } }) =>
      Object.entries(tree)
        .filter(([, parent]) => parent === args.where.parentStoreId)
        .map(([id]) => ({ id: Number(id) })),
  );
};
