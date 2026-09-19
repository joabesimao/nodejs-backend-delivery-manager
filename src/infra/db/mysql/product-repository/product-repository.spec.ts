import { ProductMysqlRepository } from "./product-repository";

const makeFakeProductRow = () => ({
  id: 1,
  name: "any_name",
  price: 10.5,
  description: "any_description",
  category: "any_category",
  subcategory: "any_subcategory",
  brand: "any_brand",
  model: "any_model",
  unit: "any_unit",
  barcode: "any_barcode",
  status: true,
  notes: "any_notes",
  imageBase64: "any_base64",
  imageMimeType: "image/png",
  variations: [{ attribute: "color", value: "red" }],
});

const makeFakePrisma = () => ({
  product: {
    create: jest.fn().mockResolvedValue(makeFakeProductRow()),
    findMany: jest.fn().mockResolvedValue([makeFakeProductRow()]),
    count: jest.fn().mockResolvedValue(1),
    findUnique: jest.fn().mockResolvedValue(makeFakeProductRow()),
    update: jest.fn().mockResolvedValue(makeFakeProductRow()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: ProductMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new ProductMysqlRepository(prisma as any);
  return { sut, prisma };
};

const makeFakeAddProduct = () => ({
  name: "any_name",
  price: 10.5,
  description: "any_description",
  category: "any_category",
  subcategory: "any_subcategory",
  brand: "any_brand",
  model: "any_model",
  unit: "any_unit",
  barcode: "any_barcode",
  status: true,
  notes: "any_notes",
  imageBase64: "data:image/png;base64,any_base64",
  imageMimeType: "image/png",
  variations: [{ attribute: "color", value: "red" }],
});

describe("Product MySql Repository", () => {
  describe("add()", () => {
    test("Should call prisma.product.create with correct values, normalizing base64 image", async () => {
      const { sut, prisma } = makeSut();
      const fakeProduct = makeFakeAddProduct();
      await sut.add(fakeProduct as any);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: fakeProduct.name,
          price: fakeProduct.price,
          description: fakeProduct.description,
          category: fakeProduct.category,
          subcategory: fakeProduct.subcategory,
          brand: fakeProduct.brand,
          model: fakeProduct.model,
          unit: fakeProduct.unit,
          barcode: fakeProduct.barcode,
          status: fakeProduct.status,
          notes: fakeProduct.notes,
          imageBase64: "any_base64",
          imageMimeType: fakeProduct.imageMimeType,
          variations: {
            create: [{ attribute: "color", value: "red" }],
          },
        },
        include: { variations: true },
      });
    });

    test("Should keep imageBase64 unchanged when it has no data: prefix", async () => {
      const { sut, prisma } = makeSut();
      const fakeProduct = { ...makeFakeAddProduct(), imageBase64: "plain_base64" };
      await sut.add(fakeProduct as any);
      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ imageBase64: "plain_base64" }),
        }),
      );
    });

    test("Should not include variations key when variations is not provided", async () => {
      const { sut, prisma } = makeSut();
      const fakeProduct = makeFakeAddProduct();
      delete (fakeProduct as any).variations;
      await sut.add(fakeProduct as any);
      const callArg = prisma.product.create.mock.calls[0][0];
      expect(callArg.data.variations).toBeUndefined();
    });

    test("Should return the product with price converted to Number", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.create.mockResolvedValueOnce({
        ...makeFakeProductRow(),
        price: "10.50" as any,
      });
      const product = await sut.add(makeFakeAddProduct() as any);
      expect(product.price).toBe(10.5);
    });

    test("Should throw if prisma.product.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(makeFakeAddProduct() as any)).rejects.toThrow();
    });
  });

  describe("getAllProducts()", () => {
    test("Should call prisma.product.findMany and count with empty where when no filter given", async () => {
      const { sut, prisma } = makeSut();
      await sut.getAllProducts();
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: "asc" },
        include: { variations: true },
      });
      expect(prisma.product.count).toHaveBeenCalledWith({ where: {} });
    });

    test("Should build where clause from name, category, priceMin and priceMax", async () => {
      const { sut, prisma } = makeSut();
      await sut.getAllProducts({
        name: "abc",
        category: "cat",
        priceMin: 5,
        priceMax: 15,
        limit: 10,
        offset: 20,
      });
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "abc" },
          category: "cat",
          price: { gte: 5, lte: 15 },
        },
        orderBy: { name: "asc" },
        include: { variations: true },
        take: 10,
        skip: 20,
      });
    });

    test("Should build price where clause with only priceMin", async () => {
      const { sut, prisma } = makeSut();
      await sut.getAllProducts({ priceMin: 5 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { price: { gte: 5 } } }),
      );
    });

    test("Should build price where clause with only priceMax", async () => {
      const { sut, prisma } = makeSut();
      await sut.getAllProducts({ priceMax: 15 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { price: { lte: 15 } } }),
      );
    });

    test("Should return items with price converted to Number and total", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.findMany.mockResolvedValueOnce([
        { ...makeFakeProductRow(), price: "10.50" as any },
      ]);
      prisma.product.count.mockResolvedValueOnce(1);
      const result = await sut.getAllProducts();
      expect(result.items[0].price).toBe(10.5);
      expect(result.total).toBe(1);
    });

    test("Should throw if prisma.product.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.getAllProducts()).rejects.toThrow();
    });

    test("Should throw if prisma.product.count throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.count.mockRejectedValueOnce(new Error());
      await expect(sut.getAllProducts()).rejects.toThrow();
    });
  });

  describe("getOneProduct()", () => {
    test("Should call prisma.product.findUnique with correct params", async () => {
      const { sut, prisma } = makeSut();
      await sut.getOneProduct(1);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { variations: true },
      });
    });

    test("Should return the product with price converted to Number", async () => {
      const { sut } = makeSut();
      const product = await sut.getOneProduct(1);
      expect(product.price).toBe(10.5);
    });

    test("Should return a falsy value when product is not found", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.findUnique.mockResolvedValueOnce(null);
      const product = await sut.getOneProduct(1);
      expect(product).toBeFalsy();
    });

    test("Should throw if prisma.product.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.getOneProduct(1)).rejects.toThrow();
    });
  });

  describe("updateProduct()", () => {
    test("Should call prisma.product.update with all provided fields", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateProduct(1, {
        name: "new_name",
        price: 20,
        description: "new_description",
        category: "new_category",
        subcategory: "new_subcategory",
        brand: "new_brand",
        model: "new_model",
        unit: "new_unit",
        barcode: "new_barcode",
        status: false,
        notes: "new_notes",
        imageBase64: "data:image/png;base64,new_base64",
        imageMimeType: "image/jpeg",
        variations: [{ attribute: "size", value: "M" }],
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "new_name",
          price: 20,
          description: "new_description",
          category: "new_category",
          subcategory: "new_subcategory",
          brand: "new_brand",
          model: "new_model",
          unit: "new_unit",
          barcode: "new_barcode",
          status: false,
          notes: "new_notes",
          imageBase64: "new_base64",
          imageMimeType: "image/jpeg",
          variations: {
            deleteMany: {},
            create: [{ attribute: "size", value: "M" }],
          },
        },
        include: { variations: true },
      });
    });

    test("Should call prisma.product.update with empty data when nothing is provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateProduct(1, {});
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
        include: { variations: true },
      });
    });

    test("Should keep imageBase64 unchanged when falsy (e.g. empty string)", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateProduct(1, { imageBase64: "" });
      const callArg = prisma.product.update.mock.calls[0][0];
      expect(callArg.data.imageBase64).toBe("");
    });

    test("Should return an updated product with price converted to Number", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.update.mockResolvedValueOnce({
        ...makeFakeProductRow(),
        price: "20.00" as any,
      });
      const product = await sut.updateProduct(1, { price: 20 });
      expect(product.price).toBe(20);
    });

    test("Should throw if prisma.product.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.update.mockRejectedValueOnce(new Error());
      await expect(sut.updateProduct(1, { name: "new_name" })).rejects.toThrow();
    });
  });

  describe("deleteById()", () => {
    test("Should call prisma.product.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteById(1);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteById(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.product.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.product.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteById(1)).rejects.toThrow();
    });
  });
});
