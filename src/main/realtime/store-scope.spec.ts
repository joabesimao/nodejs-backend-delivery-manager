import {
  getAccountScope,
  listDescendantUnitIds,
  resolveRootStoreId,
} from "./store-scope";

type UnitStoreRow = { id: number; parentStoreId: number | null };
type AccountRow = { id: number; role: string; unitStoreId: number | null };

type PrismaStubOptions = {
  unitStoreById?: Record<number, UnitStoreRow | null>;
  childrenByParentId?: Record<number, UnitStoreRow[]>;
  accountById?: Record<number, AccountRow | null>;
};

const makePrismaStub = (options: PrismaStubOptions = {}) => {
  const unitStoreById = options.unitStoreById ?? {};
  const childrenByParentId = options.childrenByParentId ?? {};
  const accountById = options.accountById ?? {};

  return {
    unitStore: {
      findUnique: jest.fn(
        async ({ where: { id } }: { where: { id: number } }) => {
          return unitStoreById[id] ?? null;
        },
      ),
      findMany: jest.fn(
        async ({
          where: { parentStoreId },
        }: {
          where: { parentStoreId: number };
        }) => {
          return childrenByParentId[parentStoreId] ?? [];
        },
      ),
    },
    account: {
      findUnique: jest.fn(
        async ({ where: { id } }: { where: { id: number } }) => {
          return accountById[id] ?? null;
        },
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

describe("store-scope", () => {
  describe("resolveRootStoreId()", () => {
    test("Should return the same id when the unit store has no parent", async () => {
      const prisma = makePrismaStub({
        unitStoreById: { 1: { id: 1, parentStoreId: null } },
      });

      const rootId = await resolveRootStoreId(prisma, 1);

      expect(rootId).toBe(1);
    });

    test("Should walk up through parents until it reaches the top-level store", async () => {
      const prisma = makePrismaStub({
        unitStoreById: {
          3: { id: 3, parentStoreId: 2 },
          2: { id: 2, parentStoreId: 1 },
          1: { id: 1, parentStoreId: null },
        },
      });

      const rootId = await resolveRootStoreId(prisma, 3);

      expect(rootId).toBe(1);
    });

    test("Should fall back to the starting id when the unit store cannot be found", async () => {
      const prisma = makePrismaStub({ unitStoreById: {} });

      const rootId = await resolveRootStoreId(prisma, 99);

      expect(rootId).toBe(99);
    });
  });

  describe("listDescendantUnitIds()", () => {
    test("Should return only the root id when it has no children", async () => {
      const prisma = makePrismaStub({ childrenByParentId: {} });

      const ids = await listDescendantUnitIds(prisma, 1);

      expect(ids).toEqual([1]);
    });

    test("Should return the root plus all nested descendant ids", async () => {
      const prisma = makePrismaStub({
        childrenByParentId: {
          1: [
            { id: 2, parentStoreId: 1 },
            { id: 3, parentStoreId: 1 },
          ],
          2: [{ id: 4, parentStoreId: 2 }],
          3: [],
          4: [],
        },
      });

      const ids = await listDescendantUnitIds(prisma, 1);

      expect([...ids].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
    });

    test("Should not process the same id twice when it is reachable through two different parents", async () => {
      const prisma = makePrismaStub({
        childrenByParentId: {
          1: [
            { id: 2, parentStoreId: 1 },
            { id: 3, parentStoreId: 1 },
          ],
          2: [{ id: 4, parentStoreId: 2 }],
          3: [{ id: 4, parentStoreId: 3 }],
          4: [],
        },
      });

      const ids = await listDescendantUnitIds(prisma, 1);

      expect([...ids].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
      expect(ids.length).toBe(4);
    });

    test("Should not loop forever when the tree contains a cycle", async () => {
      const prisma = makePrismaStub({
        childrenByParentId: {
          1: [{ id: 2, parentStoreId: 1 }],
          2: [{ id: 1, parentStoreId: 2 }],
        },
      });

      const ids = await listDescendantUnitIds(prisma, 1);

      expect([...ids].sort((a, b) => a - b)).toEqual([1, 2]);
    });
  });

  describe("getAccountScope()", () => {
    test("Should return null when the account does not exist", async () => {
      const prisma = makePrismaStub({ accountById: { 1: null } });

      const scope = await getAccountScope(prisma, 1);

      expect(scope).toBeNull();
    });

    test("Should return an empty scope when the account has no unit store linked", async () => {
      const prisma = makePrismaStub({
        accountById: { 1: { id: 1, role: "admin", unitStoreId: null } },
      });

      const scope = await getAccountScope(prisma, 1);

      expect(scope).toEqual({
        accountId: 1,
        role: "principal",
        unitStoreId: null,
        rootStoreId: null,
        visibleUnitIds: [],
      });
    });

    test("Should normalize a non-admin role to branch and restrict visibility to its own unit", async () => {
      const prisma = makePrismaStub({
        accountById: { 2: { id: 2, role: "user", unitStoreId: 5 } },
        unitStoreById: { 5: { id: 5, parentStoreId: null } },
      });

      const scope = await getAccountScope(prisma, 2);

      expect(scope).toEqual({
        accountId: 2,
        role: "branch",
        unitStoreId: 5,
        rootStoreId: 5,
        visibleUnitIds: [5],
      });
    });

    test("Should normalize admin role to principal and expose all descendant units", async () => {
      const prisma = makePrismaStub({
        accountById: { 3: { id: 3, role: "admin", unitStoreId: 10 } },
        unitStoreById: {
          10: { id: 10, parentStoreId: 1 },
          1: { id: 1, parentStoreId: null },
        },
        childrenByParentId: {
          1: [
            { id: 10, parentStoreId: 1 },
            { id: 20, parentStoreId: 1 },
          ],
          10: [],
          20: [],
        },
      });

      const scope = await getAccountScope(prisma, 3);

      expect(scope?.role).toBe("principal");
      expect(scope?.rootStoreId).toBe(1);
      expect(scope?.unitStoreId).toBe(10);
      expect([...(scope?.visibleUnitIds ?? [])].sort((a, b) => a - b)).toEqual(
        [1, 10, 20],
      );
    });
  });
});
