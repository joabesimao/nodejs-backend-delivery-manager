import { LoadDashboardOverviewController } from "./load-dashboard-overview-controller";
import { LoadDashboardPerformanceController } from "./load-dashboard-performance-controller";
import { LoadDashboardReportsController } from "./load-dashboard-reports-controller";

const cases = [
  ["LoadDashboardOverviewController", LoadDashboardOverviewController, "Falha ao carregar dados do dashboard"],
  ["LoadDashboardPerformanceController", LoadDashboardPerformanceController, "Falha ao carregar desempenho do dashboard"],
  ["LoadDashboardReportsController", LoadDashboardReportsController, "Falha ao carregar dados de relatórios do dashboard"],
] as const;

describe.each(cases)("%s", (_, Controller, errorMessage) => {
  const makeSut = () => {
    const useCase = { load: jest.fn().mockResolvedValue({ any: "result" }) };
    return { sut: new Controller(useCase as never), useCase };
  };

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should parse the period from the query", async () => {
    const { sut, useCase } = makeSut();
    await sut.handle({ query: { startDate: "2026-11-01T00:00:00.000Z", endDate: "2026-11-07T00:00:00.000Z" } });
    expect(useCase.load).toHaveBeenCalledWith({
      startDate: new Date("2026-11-01T00:00:00.000Z"),
      endDate: new Date("2026-11-07T00:00:00.000Z"),
    });
  });

  test("Should ignore empty or non-string dates", async () => {
    const { sut, useCase } = makeSut();
    await sut.handle({ query: { startDate: "", endDate: ["2026-11-07"] } });
    expect(useCase.load).toHaveBeenCalledWith({ startDate: undefined, endDate: undefined });
  });

  test("Should return 200 with the result", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({})).toEqual({ statusCode: 200, body: { any: "result" } });
  });

  test("Should return 500 with a fixed message", async () => {
    const { sut, useCase } = makeSut();
    useCase.load.mockRejectedValueOnce(new Error("db down"));
    expect(await sut.handle({})).toEqual({ statusCode: 500, body: { error: errorMessage } });
  });
});
