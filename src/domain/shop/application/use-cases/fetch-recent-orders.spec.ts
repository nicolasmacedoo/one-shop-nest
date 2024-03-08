import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchOrdersUseCase } from '@/domain/shop/application/use-cases/fetch-recent-orders'
import { expect } from 'vitest'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders', async () => {
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 7),
        userId: new UniqueEntityID('user-id'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 1),
        userId: new UniqueEntityID('user-id'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 5),
        userId: new UniqueEntityID('user-id'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.value?.orders).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 7) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 5) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 1) }),
    ])
  })

  it('should be able to fetch paginated orders', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          createdAt: new Date(2024, 0, i),
          userId: new UniqueEntityID('user-id'),
        }),
      )
    }

    const result = await sut.execute({
      userId: 'user-id',
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(2)
  })

  it('should not be able to fetch orders from another user', async () => {
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 7),
        userId: new UniqueEntityID('user-id'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 1),
        userId: new UniqueEntityID('user-id'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 5),
        userId: new UniqueEntityID('another-user-id'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.value?.orders).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 7) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 1) }),
    ])
  })
})
