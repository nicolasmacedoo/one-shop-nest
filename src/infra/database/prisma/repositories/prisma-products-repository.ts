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

  async findMany(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data,
    })
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.delete({
      where: {
        id: data.id,
      },
    })
  }
}
