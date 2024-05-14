import { faker } from '@faker-js/faker/locale/pt_BR'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = 'e51e209a-c5d3-4629-ab27-1c61582e1a0a'

  await prisma.client.deleteMany()
  await prisma.product.deleteMany()

  const clientsToInsert: Prisma.ClientUncheckedCreateInput[] = []

  for (let i = 0; i <= 50; i++) {
    clientsToInsert.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLocaleLowerCase(),
      document: faker.string
        .numeric({ length: 11, allowLeadingZeros: true })
        .toString(),
      phone: faker.helpers.fromRegExp(/([1-9]{2})[0-9]{5}-[0-9]{4}/).toString(),
      userId,
    })
  }

  const productsToInsert: Prisma.ProductUncheckedCreateInput[] = []

  for (let i = 0; i <= 50; i++) {
    productsToInsert.push({
      name: faker.commerce.productName(),
      price: faker.commerce
        .price({ dec: 2, min: 1, max: 1000 })
        .replace(',', '.'),
      stock: faker.number.int({ min: 1.99, max: 100.99 }),
      userId,
    })
  }

  await Promise.all(
    clientsToInsert.map((client) => prisma.client.create({ data: client })),
  )

  await Promise.all(
    productsToInsert.map((product) => prisma.product.create({ data: product })),
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
