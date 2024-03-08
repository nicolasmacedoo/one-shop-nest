import { fakerPT_BR as faker } from '@faker-js/faker'
import { CreateClientUseCase } from './create-client'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: CreateClientUseCase

describe('Create Client', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new CreateClientUseCase(inMemoryClientsRepository)
  })

  it('should be able to create a client', async () => {
    const result = await sut.execute({
      userId: faker.string.uuid(),
      name: faker.person.fullName(),
      document: faker.string.numeric({ length: 11, allowLeadingZeros: true }),
      phone: faker.helpers.fromRegExp(/([1-9]{2})[0-9]{5}-[0-9]{4}/),

      email: faker.internet.email(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientsRepository.items[0],
    })
  })

  it('should not be able to create a client with an already existing document', async () => {
    const document = faker.string.numeric({
      length: 11,
      allowLeadingZeros: true,
    })

    const client = makeClient({ document })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      userId: faker.string.uuid(),
      name: faker.person.fullName(),
      document,
      phone: faker.helpers.fromRegExp(/([1-9]{2})[0-9]{5}-[0-9]{4}/),
      email: faker.internet.email(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(
      new ResourceAlreadyExistsError(
        `Client with document ${document} already exists`,
      ),
    )
  })
})
