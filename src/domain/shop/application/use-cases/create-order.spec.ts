import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { CreateOrderUseCase } from './create-order'
import { makeProduct } from 'test/factories/make-product'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InsuficientItemQuantityError } from './errors/insuficient-item-quantity-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to create a order', async () => {
    const product1 = makeProduct()
    const product2 = makeProduct()

    await inMemoryProductsRepository.create(product1)
    await inMemoryProductsRepository.create(product2)

    const result = await sut.execute({
      userId: '1',
      clientId: '1',
      items: [
        {
          id: product1.id.toString(),
          quantity: 1,
        },
        {
          id: product2.id.toString(),
          quantity: 2,
        },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrdersRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({ productId: product1.id }),
      expect.objectContaining({ productId: product2.id }),
    ])
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[0].productId,
    ).toBe(product1.id)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[1].productId,
    ).toBe(product2.id)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[0].quantity,
    ).toBe(1)
    expect(
      inMemoryOrdersRepository.items[0].items.currentItems[1].quantity,
    ).toBe(2)
  })

  it('should not be able to create a order with a product that does not exist', async () => {
    const product1 = makeProduct()

    await inMemoryProductsRepository.create(product1)

    const result = await sut.execute({
      userId: '1',
      clientId: '1',
      items: [
        {
          id: 'non-existing-id',
          quantity: 1,
        },
      ],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a order with a product that does not have enough quantity', async () => {
    const product = makeProduct({
      stock: 1,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      userId: '1',
      clientId: '1',
      items: [
        {
          id: product.id.toString(),
          quantity: 2,
        },
      ],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InsuficientItemQuantityError)
  })

  it('should persist the order-item when creating a new question', async () => {
    const product1 = makeProduct()
    const product2 = makeProduct()

    await inMemoryProductsRepository.create(product1)
    await inMemoryProductsRepository.create(product2)

    const result = await sut.execute({
      userId: '1',
      clientId: '1',
      items: [
        {
          id: product1.id.toString(),
          quantity: 1,
        },
        {
          id: product2.id.toString(),
          quantity: 2,
        },
      ],
    })
    console.log(result)

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderItemsRepository.items).toHaveLength(2)
    expect(inMemoryOrderItemsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: product1.id }),
        expect.objectContaining({ productId: product2.id }),
      ]),
    )
  })
})
