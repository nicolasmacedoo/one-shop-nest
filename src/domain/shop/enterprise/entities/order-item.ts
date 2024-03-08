import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderItemProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
  price: number
  quantity: number
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId(): UniqueEntityID {
    return this.props.orderId
  }

  get productId(): UniqueEntityID {
    return this.props.productId
  }

  get price(): number {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get quantity(): number {
    return this.props.quantity
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }

  static create(props: OrderItemProps, id?: UniqueEntityID) {
    const orderItem = new OrderItem(props, id)

    return orderItem
  }
}
