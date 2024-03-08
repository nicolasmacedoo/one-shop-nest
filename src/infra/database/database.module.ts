import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaClientsRepository } from './prisma/repositories/prisma-clients-repository'
import { PrismaOrderItemsRepository } from './prisma/repositories/prisma-order-items-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClientsRepository,
    PrismaOrderItemsRepository,
    PrismaOrdersRepository,
    PrismaProductsRepository,
  ],
  exports: [
    PrismaService,
    PrismaClientsRepository,
    PrismaOrderItemsRepository,
    PrismaOrdersRepository,
    PrismaProductsRepository,
  ],
})
export class DatabaseModule {}
