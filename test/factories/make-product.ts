import {
  Product,
  ProductProps,
} from '@/domain/shop/enterprise/entities/product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaProductMapper } from '@/infra/database/prisma/mappers/prisma-product-mapper'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
): Product {
  return Product.create(
    {
      userId: new UniqueEntityID(),
      name: faker.commerce.productName(),
      stock: faker.number.int({ min: 1, max: 100 }),
      price: parseFloat(
        faker.commerce.price({
          min: 1,
          max: 100,
          dec: 2,
        }),
      ),
      ...override,
    },
    id,
  )
}

@Injectable()
export class ProductFactory {
  constructor(private readonly prisa: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data)

    await this.prisa.product.create({
      data: PrismaProductMapper.toPersistence(product),
    })

    return product
  }
}
