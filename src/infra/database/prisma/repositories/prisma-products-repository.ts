import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  findMany(userId: string, params: PaginationParams): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }

  save(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }

  create(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(product: Product): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
