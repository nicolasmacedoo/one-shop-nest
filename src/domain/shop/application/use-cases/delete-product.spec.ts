import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { DeleteProductUseCase } from '@/domain/shop/application/use-cases/delete-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { expect } from 'vitest'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('Delete Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to delete a product', async () => {
    const newProduct = makeProduct(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    await sut.execute({
      productId: 'product-1',
      userId: 'user-1',
    })

    expect(inMemoryProductsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a product from another user', async () => {
    const newProduct = makeProduct(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      productId: 'product-1',
      userId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
