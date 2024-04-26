import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get a user by id', async () => {
    const newUser = makeUser()

    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      id: newUser.id.toString(),
    })

    expect(result.value).toMatchObject({
      user: expect.objectContaining({
        name: newUser.name,
      }),
    })
  })

  it('should not be able to get a user by id if it does not exist', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
