import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Product as PrismaProduct } from '@prisma/client'

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
}
