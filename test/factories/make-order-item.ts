import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderItem,
  OrderItemProps,
} from '@/domain/shop/enterprise/entities/order-item'
import { faker } from '@faker-js/faker'

export function makeOrderItem(
  override: Partial<OrderItemProps> = {},
  id?: UniqueEntityID,
): OrderItem {
  return OrderItem.create(
    {
      productId: new UniqueEntityID(),
      orderId: new UniqueEntityID(),
      quantity: faker.number.int({ min: 1, max: 100 }),
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
