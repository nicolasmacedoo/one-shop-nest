import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { FetchClientsUseCase } from './fetch-clients'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: FetchClientsUseCase

describe('Fetch Clients', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new FetchClientsUseCase(inMemoryClientsRepository)
  })

  it('should be able to fetch clients', async () => {
    await inMemoryClientsRepository.create(
      makeClient({ name: 'John Doe', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryClientsRepository.create(
      makeClient({ name: 'Jane Doe', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryClientsRepository.create(
      makeClient({ name: 'Foo Bar', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryClientsRepository.create(
      makeClient({ name: 'Bar Foo', userId: new UniqueEntityID('user-id') }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.clients).toEqual([
      expect.objectContaining({ name: 'Bar Foo' }),
      expect.objectContaining({ name: 'Foo Bar' }),
      expect.objectContaining({ name: 'Jane Doe' }),
      expect.objectContaining({ name: 'John Doe' }),
    ])
  })

  it('should be able to fetch paginated products', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryClientsRepository.create(
        makeClient({
          name: `Client ${i}`,
          userId: new UniqueEntityID('user-id'),
        }),
      )
    }

    const result = await sut.execute({
      userId: 'user-id',
      page: 2,
    })

    expect(result.value?.clients).toHaveLength(2)
  })

  it('should not be able to fetch clients from another user', async () => {
    await inMemoryClientsRepository.create(
      makeClient({ name: 'John Doe', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryClientsRepository.create(
      makeClient({ name: 'Jane Doe', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryClientsRepository.create(
      makeClient({
        name: 'Foo Bar',
        userId: new UniqueEntityID('another-user-id'),
      }),
    )
    await inMemoryClientsRepository.create(
      makeClient({
        name: 'Bar Foo',
        userId: new UniqueEntityID('another-user-id'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.clients).toEqual([
      expect.objectContaining({ name: 'Jane Doe' }),
      expect.objectContaining({ name: 'John Doe' }),
    ])
  })
})
