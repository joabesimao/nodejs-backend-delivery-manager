import { ACCOUNT_ROLES, isAccountRole } from "./account-role";

describe("isAccountRole", () => {
  test.each(ACCOUNT_ROLES)("aceita o role %s", (role) => {
    expect(isAccountRole(role)).toBe(true);
  });

  test.each([
    ["superadmin"],
    ["ADMIN"],
    [""],
    [undefined],
    [null],
    [1],
    [["admin"]],
  ])("rejeita %p", (value) => {
    expect(isAccountRole(value)).toBe(false);
  });
});
