import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditProductUseCase } from '@/domain/shop/application/use-cases/edit-product'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new EditProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to edit a product', async () => {
    const newProduct = makeProduct(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    await sut.execute({
      userId: 'user-1',
      name: 'Produto teste',
      quantity: 10,
      productId: newProduct.id.toString(),
    })

    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      name: 'Produto teste',
      quantity: 10,
    })
  })

  it('should not be able to edit a product from another user', async () => {
    const newProduct = makeProduct(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('product-1'),
    )

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      userId: 'user-2',
      name: 'Produto teste',
      quantity: 10,
      productId: newProduct.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
