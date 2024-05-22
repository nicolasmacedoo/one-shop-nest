import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Products (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    productFactory = moduleRef.get(ProductFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /products', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      productFactory.makePrismaProduct({
        name: 'Product 1',
        userId: user.id,
      }),
      productFactory.makePrismaProduct({
        name: 'Product 2',
        userId: user.id,
      }),
      productFactory.makePrismaProduct({
        name: 'Product 3',
        userId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ name: 'Product 1' }),
        expect.objectContaining({ name: 'Product 2' }),
        expect.objectContaining({ name: 'Product 3' }),
      ]),
      totalCount: 3,
    })
  })
})
