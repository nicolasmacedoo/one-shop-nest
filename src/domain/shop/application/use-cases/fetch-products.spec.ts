import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { FetchProductsUseCase } from '@/domain/shop/application/use-cases/fetch-products'
import { makeProduct } from 'test/factories/make-product'
import { expect } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchProductsUseCase

describe('Fetch Products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchProductsUseCase(inMemoryProductsRepository)
  })

  it('should be able to fetch products', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Apagador', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Borracha', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Lapis', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Caneta', userId: new UniqueEntityID('user-id') }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: 'Apagador' }),
      expect.objectContaining({ name: 'Borracha' }),
      expect.objectContaining({ name: 'Caneta' }),
      expect.objectContaining({ name: 'Lapis' }),
    ])
    expect(result.value?.totalCount).toBe(4)
  })

  it('should be able to fetch paginated products', async () => {
    for (let i = 0; i < 12; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({
          name: `Product ${i}`,
          userId: new UniqueEntityID('user-id'),
        }),
      )
    }

    const result = await sut.execute({
      userId: 'user-id',
      page: 2,
    })

    expect(result.value?.products).toHaveLength(2)
    expect(result.value?.totalCount).toBe(12)
  })

  it('should not be able to fetch products from another user', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Apagador', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Borracha', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        name: 'Lapis',
        userId: new UniqueEntityID('another-user-id'),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        name: 'Caneta',
        userId: new UniqueEntityID('another-user-id'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    })

    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: 'Apagador' }),
      expect.objectContaining({ name: 'Borracha' }),
    ])
  })

  it('should be able to fetch products by query', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Apagador', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Borracha', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Lapis', userId: new UniqueEntityID('user-id') }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({ name: 'Caneta', userId: new UniqueEntityID('user-id') }),
    )

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
      query: 'Lapis',
    })

    expect(result.value?.products).toEqual([
      expect.objectContaining({ name: 'Lapis' }),
    ])
    expect(result.value?.totalCount).toBe(1)
  })
})
