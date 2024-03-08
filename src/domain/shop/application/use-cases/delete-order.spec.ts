import { DeleteOrderUseCase } from '@/domain/shop/application/use-cases/delete-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { Order } from '../../enterprise/entities/order'
import { OrderItemsList } from '../../enterprise/entities/order-items-list'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { OrderItem } from '../../enterprise/entities/order-item'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const newOrder = Order.create(
      {
        userId: new UniqueEntityID('user-1'),
        clientId: new UniqueEntityID('client-1'),
        items: new OrderItemsList([]),
      },
      new UniqueEntityID('order-1'),
    )

    await inMemoryOrdersRepository.create(newOrder)

    inMemoryOrderItemsRepository.items.push(
      OrderItem.create(
        {
          orderId: newOrder.id,
          productId: new UniqueEntityID('1'),
          price: 10.0,
          quantity: 1,
        },
        new UniqueEntityID('1'),
      ),
      OrderItem.create(
        {
          orderId: newOrder.id,
          productId: new UniqueEntityID('2'),
          price: 20.0,
          quantity: 3,
        },
        new UniqueEntityID('2'),
      ),
    )

    await sut.execute({
      orderId: 'order-1',
      userId: 'user-1',
    })

    expect(inMemoryOrdersRepository.items).toHaveLength(0)
    expect(inMemoryOrderItemsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a order from another user', async () => {
    const newOrder = Order.create({
      userId: new UniqueEntityID('user-1'),
      clientId: new UniqueEntityID('client-1'),
      items: new OrderItemsList([]),
    })

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      userId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
