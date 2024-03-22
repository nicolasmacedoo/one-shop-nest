import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { DeleteClientUseCase } from '@/domain/shop/application/use-cases/delete-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { expect } from 'vitest'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: DeleteClientUseCase

describe('Delete Client', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new DeleteClientUseCase(inMemoryClientsRepository)
  })

  it('should be able to delete a client', async () => {
    const newClient = makeClient(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('client-1'),
    )

    await inMemoryClientsRepository.create(newClient)

    await sut.execute({
      clientId: 'client-1',
      userId: 'user-1',
    })

    expect(inMemoryClientsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a client from another user', async () => {
    const newClient = makeClient(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('client-1'),
    )

    await inMemoryClientsRepository.create(newClient)

    const result = await sut.execute({
      clientId: 'client-1',
      userId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
