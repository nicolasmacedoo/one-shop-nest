import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { OrderFactory } from 'test/factories/make-order'
import { OrderItemFactory } from 'test/factories/make-order-item'
import { ProductFactory } from 'test/factories/make-product'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Orders (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let orderFactory: OrderFactory
  let clientFactory: ClientFactory
  let productFactory: ProductFactory
  let orderItemFactory: OrderItemFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        OrderFactory,
        ClientFactory,
        OrderItemFactory,
        ProductFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    orderFactory = moduleRef.get(OrderFactory)
    clientFactory = moduleRef.get(ClientFactory)
    productFactory = moduleRef.get(ProductFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /orders', async () => {
    const user = await userFactory.makePrismaUser()

    const client = await clientFactory.makePrismaClient({
      userId: user.id,
    })

    const product1 = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const product2 = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const order1 = await orderFactory.makePrismaOrder({
      clientId: client.id,
      userId: user.id,
    })
    const order2 = await orderFactory.makePrismaOrder({
      clientId: client.id,
      userId: user.id,
    })
    const order3 = await orderFactory.makePrismaOrder({
      clientId: client.id,
      userId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      orderItemFactory.makePrismaOrderItem({
        orderId: order1.id,
        productId: product1.id,
        quantity: 2,
      }),
      orderItemFactory.makePrismaOrderItem({
        orderId: order1.id,
        productId: product2.id,
        quantity: 3,
      }),
      orderItemFactory.makePrismaOrderItem({
        orderId: order2.id,
        productId: product1.id,
        quantity: 3,
      }),
      orderItemFactory.makePrismaOrderItem({
        orderId: order3.id,
        productId: product2.id,
        quantity: 4,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ client: client.name }),
        expect.objectContaining({ client: client.name }),
        expect.objectContaining({ client: client.name }),
      ]),
      totalCount: 3,
    })
  })
})
