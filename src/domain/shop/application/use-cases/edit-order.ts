import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrderItemsList } from '../../enterprise/entities/order-items-list'
import { NotAllowedError } from './errors/not-allowed-error'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditOrderUseCaseRequest {
  userId: string
  clientId: string
  orderId: string
  items: {
    id: string
    quantity: number
  }[]
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private orderRepository: OrdersRepository,
    private orderItemRepository: OrderItemsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    clientId,
    orderId,
    items,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== order.userId.toString()) {
      return left(new NotAllowedError())
    }

    const currentOrderItems =
      await this.orderItemRepository.findManyByOrderId(orderId)

    console.log('CURRENT', currentOrderItems)

    const orderItemstList = new OrderItemsList(currentOrderItems)

    const orderItems: OrderItem[] = []

    for (const item of items) {
      const product = await this.productsRepository.findById(item.id)

      if (!product) {
        return left(
          new ResourceNotFoundError(`Product with id ${item.id} not found`),
        )
      }

      const orderItem = OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      orderItems.push(orderItem)
    }

    orderItemstList.update(orderItems)

    order.items = orderItemstList

    order.clientId = new UniqueEntityID(clientId)

    order.total = orderItemstList
      .getItems()
      .reduce((acc, item) => (acc += item.price * item.quantity), 0)

    // await this.orderItemRepository.deleteMany(orderItemstList.getRemovedItems())

    await this.orderRepository.save(order)

    // console.log('ORDER USE CASE', order.items.getItems())

    return right({
      order,
    })
  }
}
