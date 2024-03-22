import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditClientUseCase } from '@/domain/shop/application/use-cases/edit-client'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: EditClientUseCase

describe('Edit Client', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new EditClientUseCase(inMemoryClientsRepository)
  })

  it('should be able to edit a client', async () => {
    const newClient = makeClient(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('client-1'),
    )

    await inMemoryClientsRepository.create(newClient)

    await sut.execute({
      userId: 'user-1',
      name: 'New name',
      document: '123456789',
      email: 'new-email@email.com',
      phone: '123456789',
      clientId: newClient.id.toString(),
    })

    expect(inMemoryClientsRepository.items[0]).toMatchObject({
      name: 'New name',
      document: '123456789',
      email: 'new-email@email.com',
      phone: '123456789',
    })
  })

  it('should not be able to edit a client from another user', async () => {
    const newClient = makeClient(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('client-1'),
    )

    await inMemoryClientsRepository.create(newClient)

    const result = await sut.execute({
      userId: 'user-2',
      name: 'New name',
      document: '123456789',
      email: 'new-email@email.com',
      phone: '123456789',
      clientId: newClient.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('not should be able to edit a client that does not exist', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'New name',
      document: '123456789',
      email: 'new-email@email.com',
      phone: '123456789',
      clientId: 'client-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
