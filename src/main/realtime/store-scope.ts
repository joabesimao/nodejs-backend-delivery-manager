import { Prisma, PrismaClient } from "@prisma/client";

type AccountScope = {
  accountId: number;
  role: "principal" | "branch";
  unitStoreId: number | null;
  rootStoreId: number | null;
  visibleUnitIds: number[];
};

const uniqueNumbers = (values: number[]): number[] =>
  Array.from(
    new Set(values.filter((value) => Number.isFinite(value) && value > 0)),
  );

const isLegacySchemaError = (error: unknown): boolean => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  return error.code === "P2021" || error.code === "P2022";
};

export const resolveRootStoreId = async (
  prisma: PrismaClient,
  startUnitStoreId: number,
): Promise<number> => {
  let current = await prisma.unitStore.findUnique({
    where: { id: startUnitStoreId },
    select: { id: true, parentStoreId: true },
  });

  while (current?.parentStoreId) {
    current = await prisma.unitStore.findUnique({
      where: { id: current.parentStoreId },
      select: { id: true, parentStoreId: true },
    });
  }

  return current?.id ?? startUnitStoreId;
};

export const listDescendantUnitIds = async (
  prisma: PrismaClient,
  rootUnitStoreId: number,
): Promise<number[]> => {
  const visited = new Set<number>();
  const queue: number[] = [rootUnitStoreId];

  while (queue.length > 0) {
    const currentId = queue.shift() as number;

    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const children = await prisma.unitStore.findMany({
      where: { parentStoreId: currentId },
      select: { id: true },
    });

    for (const child of children) {
      if (!visited.has(child.id)) {
        queue.push(child.id);
      }
    }
  }

  return Array.from(visited);
};

export const getAccountScope = async (
  prisma: PrismaClient,
  accountId: number,
): Promise<AccountScope | null> => {
  let account: {
    id: number;
    role: "principal" | "branch";
    unitStoreId: number | null;
  } | null = null;

  try {
    account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        role: true,
        unitStoreId: true,
      },
    });
  } catch (error) {
    if (!isLegacySchemaError(error)) {
      throw error;
    }

    const basicAccount = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
      },
    });

    account = basicAccount
      ? {
          id: basicAccount.id,
          role: "branch",
          unitStoreId: null,
        }
      : null;
  }

  if (!account) {
    return null;
  }

  const normalizedRole = account.role === "principal" ? "principal" : "branch";

  if (!account.unitStoreId) {
    return {
      accountId: account.id,
      role: normalizedRole,
      unitStoreId: null,
      rootStoreId: null,
      visibleUnitIds: [],
    };
  }

  let rootStoreId = account.unitStoreId;
  try {
    rootStoreId = await resolveRootStoreId(prisma, account.unitStoreId);
  } catch (error) {
    if (!isLegacySchemaError(error)) {
      throw error;
    }
  }

  let visibleUnitIds: number[];
  if (normalizedRole === "principal") {
    try {
      visibleUnitIds = await listDescendantUnitIds(prisma, rootStoreId);
    } catch (error) {
      if (!isLegacySchemaError(error)) {
        throw error;
      }

      visibleUnitIds = [account.unitStoreId];
    }
  } else {
    visibleUnitIds = [account.unitStoreId];
  }

  return {
    accountId: account.id,
    role: normalizedRole,
    unitStoreId: account.unitStoreId,
    rootStoreId,
    visibleUnitIds: uniqueNumbers(visibleUnitIds),
  };
};
