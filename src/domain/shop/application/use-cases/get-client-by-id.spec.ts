import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { GetClientByIdUseCase } from './get-client-by-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: GetClientByIdUseCase

describe('Get Client By Id', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new GetClientByIdUseCase(inMemoryClientsRepository)
  })

  it('should be able to get a client by id', async () => {
    const client = makeClient()
    inMemoryClientsRepository.create(client)

    const result = await sut.execute({ id: client.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientsRepository.items[0],
    })
    expect(result.value).toMatchObject({
      client: expect.objectContaining({
        id: client.id,
      }),
    })
  })

  it('should not be able to get a client by id if it does not exist', async () => {
    const result = await sut.execute({ id: 'invalid-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFoundError())
  })
})
