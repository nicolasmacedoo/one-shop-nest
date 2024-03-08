import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { GetProductByIdUseCase } from '@/domain/shop/application/use-cases/get-product-by-id'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetProductByIdUseCase

describe('Get Product By Id', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new GetProductByIdUseCase(inMemoryProductsRepository)
  })

  it('should be able to get a product by id', async () => {
    const newProduct = makeProduct()

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      id: newProduct.id.toString(),
    })

    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        name: newProduct.name,
      }),
    })
  })

  it('should not be able to get a product by id if it does not exist', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
