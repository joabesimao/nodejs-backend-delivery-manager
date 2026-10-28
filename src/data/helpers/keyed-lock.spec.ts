import { KeyedLock } from "./keyed-lock";

const delay = async (ms: number): Promise<void> => await new Promise((resolve) => setTimeout(resolve, ms));

describe("KeyedLock", () => {
  test("Should run tasks with the same key one at a time, in order", async () => {
    const sut = new KeyedLock();
    const events: string[] = [];
    const task = (name: string, ms: number) => async () => {
      events.push(`${name}:start`);
      await delay(ms);
      events.push(`${name}:end`);
      return name;
    };

    const results = await Promise.all([sut.run("k", task("a", 10)), sut.run("k", task("b", 1))]);

    expect(results).toEqual(["a", "b"]);
    expect(events).toEqual(["a:start", "a:end", "b:start", "b:end"]);
  });

  test("Should run tasks with different keys in parallel", async () => {
    const sut = new KeyedLock();
    const events: string[] = [];
    await Promise.all([
      sut.run("a", async () => { events.push("a:start"); await delay(10); events.push("a:end"); }),
      sut.run("b", async () => { events.push("b:start"); await delay(1); events.push("b:end"); }),
    ]);
    expect(events.slice(0, 2)).toEqual(["a:start", "b:start"]);
  });

  test("Should propagate a failure without blocking the next task", async () => {
    const sut = new KeyedLock();
    const failing = sut.run("k", async () => { throw new Error("boom"); });
    const next = sut.run("k", async () => "ok");
    await expect(failing).rejects.toThrow("boom");
    await expect(next).resolves.toBe("ok");
  });
});
