import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { EditOrderUseCase } from './edit-order'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItemsList } from '../../enterprise/entities/order-items-list'
import { Order } from '../../enterprise/entities/order'
import { NotAllowedError } from './errors/not-allowed-error'
import { makeOrderItem } from 'test/factories/make-order-item'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    sut = new EditOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryOrderItemsRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const order = Order.create({
      userId: new UniqueEntityID('1'),
      clientId: new UniqueEntityID('1'),
      items: new OrderItemsList([]),
    })

    await inMemoryOrdersRepository.create(order)

    const product1 = makeProduct()
    const product2 = makeProduct()
    const product3 = makeProduct()

    await inMemoryProductsRepository.create(product1)
    await inMemoryProductsRepository.create(product2)
    await inMemoryProductsRepository.create(product3)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({ orderId: order.id, productId: product1.id }),
      makeOrderItem({ orderId: order.id, productId: product2.id }),
    )

    const result = await sut.execute({
      userId: '1',
      orderId: '1',
      items: [
        {
          id: product3.id.toString(),
          quantity: 55,
        },
        {
          id: product1.id.toString(),
          quantity: 21,
        },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrdersRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({ productId: product3.id }),
      expect.objectContaining({ productId: product1.id }),
    ])
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[0].productId,
    ).toBe(product3.id)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[1].productId,
    ).toBe(product1.id)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[0].quantity,
    ).toBe(55)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[1].quantity,
    ).toBe(21)
  })

  it('should not be able to edit a order from another user', async () => {
    const order = Order.create({
      userId: new UniqueEntityID('1'),
      clientId: new UniqueEntityID('1'),
      items: new OrderItemsList([]),
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      userId: '2',
      orderId: '1',
      items: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
