import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findMany(
    userId: string,
    { page, query }: PaginationParams,
  ): Promise<{
    products: Product[]
    totalCount: number
  }> {
    const allProducts = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    const products = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 10, page * 10)

    if (query) {
      const queryProducts = products.filter((item) => item.name.includes(query))
      return {
        products: queryProducts,
        totalCount: queryProducts.length,
      }
    }

    return {
      products,
      totalCount: allProducts.length,
    }
  }

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async save(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id)

    this.items[index] = product
  }

  async delete(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id)

    this.items.splice(index, 1)
  }
}
