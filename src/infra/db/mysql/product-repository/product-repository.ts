import { PrismaClient } from "@prisma/client";
import { AddProductRepository } from "../../../../data/protocols/db/product/add-product-repository";
import { DeleteProductByIdRepository } from "../../../../data/protocols/db/product/delete-product-repository";
import {
  LoadProductByIdRepository,
  LoadProductRepository,
} from "../../../../data/protocols/db/product/load-product-repository";
import { UpdateProductRepository } from "../../../../data/protocols/db/product/update-product-repository";
import {
  Product,
  ProductModel,
  LoadProductFilter,
  LoadProductResult,
} from "../../../../domain/models/product/product";
import { AddProductModel } from "../../../../domain/usescases/product/add-product/add-product";

const normalizeBase64 = (imageBase64: string): string => {
  if (!imageBase64) {
    return imageBase64;
  }

  const marker = ",";
  const markerIndex = imageBase64.indexOf(marker);

  if (markerIndex >= 0 && imageBase64.startsWith("data:")) {
    return imageBase64.slice(markerIndex + 1);
  }

  return imageBase64;
};

export class ProductMysqlRepository
  implements
    AddProductRepository,
    LoadProductRepository,
    LoadProductByIdRepository,
    UpdateProductRepository,
    DeleteProductByIdRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async add(product: AddProductModel): Promise<Product> {
    const { variations, imageBase64, ...rest } = product;
    const result = await this.prisma.product.create({
      data: {
        name: rest.name,
        price: rest.price,
        description: rest.description,
        category: rest.category,
        subcategory: rest.subcategory,
        brand: rest.brand,
        model: rest.model,
        unit: rest.unit,
        barcode: rest.barcode,
        status: rest.status,
        notes: rest.notes,
        imageBase64: imageBase64 ? normalizeBase64(imageBase64) : imageBase64,
        imageMimeType: rest.imageMimeType,
        ...(variations && {
          variations: {
            create: variations.map((v) => ({ attribute: v.attribute, value: v.value })),
          },
        }),
      },
      include: { variations: true },
    });
    return { ...result, price: Number(result.price) };
  }

  async getAllProducts(filter: LoadProductFilter = {}): Promise<LoadProductResult> {
    const { name, category, priceMin, priceMax, limit, offset } = filter;

    const where: any = {};
    if (name) where.name = { contains: name };
    if (category) where.category = category;
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
        include: { variations: true },
        ...(limit !== undefined && { take: limit }),
        ...(offset !== undefined && { skip: offset }),
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((product) => ({ ...product, price: Number(product.price) })),
      total,
    };
  }

  async getOneProduct(id: number): Promise<Product> {
    const result = await this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: { variations: true },
    });
    return result && { ...result, price: Number(result.price) };
  }

  async updateProduct(id: number, info: Partial<ProductModel>): Promise<Product> {
    const { variations, imageBase64, ...rest } = info;
    const result = await this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(rest.name && { name: rest.name }),
        ...(rest.price !== undefined && { price: rest.price }),
        ...(rest.description && { description: rest.description }),
        ...(rest.category && { category: rest.category }),
        ...(rest.subcategory !== undefined && { subcategory: rest.subcategory }),
        ...(rest.brand !== undefined && { brand: rest.brand }),
        ...(rest.model !== undefined && { model: rest.model }),
        ...(rest.unit !== undefined && { unit: rest.unit }),
        ...(rest.barcode !== undefined && { barcode: rest.barcode }),
        ...(rest.status !== undefined && { status: rest.status }),
        ...(rest.notes !== undefined && { notes: rest.notes }),
        ...(imageBase64 !== undefined && {
          imageBase64: imageBase64 ? normalizeBase64(imageBase64) : imageBase64,
        }),
        ...(rest.imageMimeType !== undefined && { imageMimeType: rest.imageMimeType }),
        ...(variations !== undefined && {
          variations: {
            deleteMany: {},
            create: variations.map((v) => ({ attribute: v.attribute, value: v.value })),
          },
        }),
      },
      include: { variations: true },
    });
    return { ...result, price: Number(result.price) };
  }

  async deleteById(id: number): Promise<string> {
    await this.prisma.product.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
