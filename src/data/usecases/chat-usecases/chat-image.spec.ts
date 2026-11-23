import { estimateBase64Bytes, normalizeBase64 } from "./chat-image";

describe("chat-image", () => {
  test("normalizeBase64 removes the data: prefix only", () => {
    expect(normalizeBase64("data:image/png;base64,QUJD")).toBe("QUJD");
    expect(normalizeBase64("QUJD")).toBe("QUJD");
    expect(normalizeBase64("a,b")).toBe("a,b");
    expect(normalizeBase64("")).toBe("");
  });

  test("estimateBase64Bytes discounts the padding", () => {
    expect(estimateBase64Bytes("QUJD")).toBe(3);
    expect(estimateBase64Bytes("QUI=")).toBe(2);
    expect(estimateBase64Bytes("QQ==")).toBe(1);
  });
});
