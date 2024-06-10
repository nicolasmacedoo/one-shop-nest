import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { OrderFactory } from 'test/factories/make-order'
import { OrderItemFactory } from 'test/factories/make-order-item'
import { ProductFactory } from 'test/factories/make-product'
import { UserFactory } from 'test/factories/make-user'

describe('Edit Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let clientFactory: ClientFactory
  let productFactory: ProductFactory
  let orderFactory: OrderFactory
  let orderItemFactory: OrderItemFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ClientFactory,
        ProductFactory,
        OrderFactory,
        OrderItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    clientFactory = moduleRef.get(ClientFactory)
    productFactory = moduleRef.get(ProductFactory)
    orderFactory = moduleRef.get(OrderFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /orders/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const client1 = await clientFactory.makePrismaClient({
      userId: user.id,
    })

    const client2 = await clientFactory.makePrismaClient({
      userId: user.id,
    })

    const product1 = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const product2 = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const order = await orderFactory.makePrismaOrder({
      userId: user.id,
      clientId: client1.id,
    })

    await orderItemFactory.makePrismaOrderItem({
      orderId: order.id,
      productId: product1.id,
      price: product1.price,
      quantity: 1,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        clientId: client2.id.toString(),
        orderItems: [
          {
            id: product2.id.toString(),
            quantity: 2,
          },
        ],
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    expect(orderOnDatabase).toBeTruthy()

    const orderItemOnDatabase = await prisma.orderItem.findMany({
      where: {
        orderId,
      },
    })

    const total = orderItemOnDatabase.reduce(
      (acc, item) => (acc += Number(item.price) * item.quantity),
      0,
    )

    const editedOrder = {
      clientId: orderOnDatabase?.clientId,
      total,
    }

    expect(editedOrder).toEqual(
      expect.objectContaining({
        clientId: client2.id.toString(),
        total,
      }),
    )

    expect(orderItemOnDatabase).toHaveLength(1)
    expect(orderItemOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productId: product2.id.toString(),
        }),
      ]),
    )
  })
})
