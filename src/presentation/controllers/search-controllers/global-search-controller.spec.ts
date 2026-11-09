import { GlobalSearchController } from "./global-search-controller";

const makeResult = () => ({ query: "ana", orders: [], clients: [], deliverymen: [] });

const makeSut = () => {
  const globalSearch = { search: jest.fn().mockResolvedValue(makeResult()) };
  return { sut: new GlobalSearchController(globalSearch), globalSearch };
};

describe("GlobalSearch Controller", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should trim the term and use an empty term when absent", async () => {
    const { sut, globalSearch } = makeSut();
    await sut.handle({ query: { q: " ana " } });
    expect(globalSearch.search).toHaveBeenLastCalledWith("ana");
    await sut.handle({ query: { q: ["ana"] } });
    expect(globalSearch.search).toHaveBeenLastCalledWith("");
    await sut.handle({});
    expect(globalSearch.search).toHaveBeenLastCalledWith("");
  });

  test("Should return 200 with the result", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ query: { q: "ana" } })).toEqual({ statusCode: 200, body: makeResult() });
  });

  test("Should return 500 with a fixed message", async () => {
    const { sut, globalSearch } = makeSut();
    globalSearch.search.mockRejectedValueOnce(new Error("db down"));
    expect(await sut.handle({ query: { q: "ana" } })).toEqual({
      statusCode: 500,
      body: { error: "Falha ao realizar a busca" },
    });
  });
});
