import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrderItemsList } from '../../enterprise/entities/order-items-list'
import { InsuficientItemQuantityError } from './errors/insuficient-item-quantity-error'

interface CreateOrderUseCaseRequest {
  userId: string
  clientId: string
  items: {
    id: string
    quantity: number
  }[]
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | InsuficientItemQuantityError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    clientId,
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      userId: new UniqueEntityID(userId),
      clientId: new UniqueEntityID(clientId),
      items: new OrderItemsList(),
    })

    const orderItems: OrderItem[] = []

    for (const item of items) {
      const product = await this.productsRepository.findById(item.id)

      if (!product) {
        return left(
          new ResourceNotFoundError(`Product with id ${item.id} not found`),
        )
      }

      if (product.stock < item.quantity) {
        return left(
          new InsuficientItemQuantityError(
            `Insuficient ${product.name} quantity`,
          ),
        )
      }

      product.stock -= item.quantity

      const orderItem = OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      orderItems.push(orderItem)
    }

    order.items = new OrderItemsList(orderItems)

    this.orderRepository.create(order)

    return right({
      order,
    })
  }
}
