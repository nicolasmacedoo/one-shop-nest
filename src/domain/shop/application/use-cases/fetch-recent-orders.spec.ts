import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchOrdersUseCase } from '@/domain/shop/application/use-cases/fetch-recent-orders'
import { expect } from 'vitest'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
      inMemoryClientsRepository,
    )
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders', async () => {
    const client = makeClient({ name: 'John Doe' })

    inMemoryClientsRepository.items.push(client)

    const order1 = makeOrder({
      createdAt: new Date(2024, 0, 7),
      userId: new UniqueEntityID('user-id'),
      clientId: client.id,
    })
    const order2 = makeOrder({
      createdAt: new Date(2024, 0, 1),
      userId: new UniqueEntityID('user-id'),
      clientId: client.id,
    })
    const order3 = makeOrder({
      createdAt: new Date(2024, 0, 5),
      userId: new UniqueEntityID('user-id'),
      clientId: client.id,
    })

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
    expect(result.value?.orders).toEqual([
      expect.objectContaining({
        createdAt: new Date(2024, 0, 7),
        clientId: client.id,
        clientName: 'John Doe',
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 5),
        clientId: client.id,
        clientName: 'John Doe',
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 1),
        clientId: client.id,
        clientName: 'John Doe',
      }),
    ])
  })

  it('should be able to fetch paginated orders', async () => {
    const client = makeClient({ name: 'John Doe' })

    inMemoryClientsRepository.items.push(client)

    for (let i = 0; i < 22; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          createdAt: new Date(2024, 0, i),
          userId: new UniqueEntityID('user-id'),
          clientId: client.id,
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
    const client = makeClient({ name: 'John Doe' })

    inMemoryClientsRepository.items.push(client)

    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 7),
        userId: new UniqueEntityID('user-id'),
        clientId: client.id,
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 1),
        userId: new UniqueEntityID('user-id'),
        clientId: client.id,
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        createdAt: new Date(2024, 0, 5),
        userId: new UniqueEntityID('another-user-id'),
        clientId: client.id,
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
