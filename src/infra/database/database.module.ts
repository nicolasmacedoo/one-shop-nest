import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaClientsRepository } from './prisma/repositories/prisma-clients-repository'
import { PrismaOrderItemsRepository } from './prisma/repositories/prisma-order-items-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { UsersRepository } from '@/domain/shop/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { ClientsRepository } from '@/domain/shop/application/repositories/clients-repository'
import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: OrderItemsRepository,
      useClass: PrismaOrderItemsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [
    PrismaService,
    OrderItemsRepository,
    OrdersRepository,
    ClientsRepository,
    ProductsRepository,
    UsersRepository,
  ],
})
export class DatabaseModule {}
