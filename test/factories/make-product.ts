import {
  Product,
  ProductProps,
} from '@/domain/shop/enterprise/entities/product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

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
