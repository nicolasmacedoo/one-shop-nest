import { Product as PrismaProduct, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/shop/enterprise/entities/product'

export class PrismaProductMapper {
  public static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        price: Number(raw.price),
        stock: raw.stock,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  // or toPrisma
  public static toPersistence(
    product: Product,
  ): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      userId: product.userId.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
