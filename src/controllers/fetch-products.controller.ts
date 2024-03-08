import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/products')
@UseGuards(JwtAuthGuard)
export class FetchProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const perPage = 1

    const products = await this.prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        userId: user.sub,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      products,
    }
  }
}
