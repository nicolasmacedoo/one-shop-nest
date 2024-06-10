import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { InMemoryClientsRepository } from './in-memory-clients-repository'
import { OrderWithClient } from '@/domain/shop/enterprise/entities/value-objects/order-with-client'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private orderItemsRepository: OrderItemsRepository,
    private clientsRepository: InMemoryClientsRepository,
  ) { }

  async findById(id: string): Promise<Order | null> {
    const product = this.items.find((item) => item.id, toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findManyRecent(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyRecentWithClient(
    userId: string,
    { page, query }: PaginationParams,
  ): Promise<{
    orders: OrderWithClient[]
    totalCount: number
  }> {
    const allOrders = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    const orders = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)
      .map((order) => {
        // const client = this.clientsRepository.findById(order.clientId.toString())
        const client = this.clientsRepository.items.find((client) => {
          return client.id.equals(order.clientId)
        })

        if (!client) {
          throw new Error(
            `Client with ID ${order.clientId.toString()} not found for order ${order.id.toString()}`,
          )
        }

        return OrderWithClient.create({
          clientId: order.clientId,
          clientName: client.name,
          orderId: order.id,
          orderTotal: order.total,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items.getItems(),
        })
      })

    if (query) {
      const queryOrders = orders.filter((item) =>
        item.clientName.includes(query),
      )
      return {
        orders: queryOrders,
        totalCount: queryOrders.length,
      }
    }

    return {
      orders,
      totalCount: allOrders.length,
    }
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    await this.orderItemsRepository.createMany(order.items.getNewItems())

    await this.orderItemsRepository.deleteMany(order.items.getRemovedItems())

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)

    await this.orderItemsRepository.createMany(order.items.getItems())

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)

    this.orderItemsRepository.deleteManyByOrderId(order.id.toString())
  }
}

// export class InMemoryOrderRepository extends BaseInMemoryRepository<Order> implements OrderRepository {
//   async findByUserId(userId: string): Promise<Order[]> {
//     return this.items.filter((item) => item.userId.toString() === userId)
//   }
// }

// export abstract class BaseInMemoryRepository<T> {
//   protected items: T[] = [];

//   async add(item: T): Promise<void> {
//     this.items.push(item);
//   }

//   async remove(item: T): Promise<void> {
//     const index = this.items.indexOf(item);
//     if (index > -1) {
//       this.items.splice(index, 1);
//     }
//   }

//   async findAll(): Promise<T[]> {
//     return this.items;
//   }
// }
