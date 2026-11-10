import { Actor } from "../presentation/protocols/http";

export const makeFakeActor = (overrides: Partial<Actor> = {}): Actor => ({
  id: 1,
  role: "admin",
  unitStoreId: null,
  ...overrides,
});
