import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Products (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /products', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.product.createMany({
      data: [
        {
          name: 'Product 1',
          price: 100,
          stock: 10,
          userId: user.id,
        },
        {
          name: 'Product 2',
          price: 200,
          stock: 20,
          userId: user.id,
        },
        {
          name: 'Product 3',
          price: 300,
          stock: 30,
          userId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      products: [
        expect.objectContaining({ name: 'Product 1' }),
        expect.objectContaining({ name: 'Product 2' }),
        expect.objectContaining({ name: 'Product 3' }),
      ],
    })
  })
})
