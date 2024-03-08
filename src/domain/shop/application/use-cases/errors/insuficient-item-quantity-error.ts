import { UseCaseError } from '@/core/errors/use-case-error'

export class InsuficientItemQuantityError
  extends Error
  implements UseCaseError
{
  constructor(message?: string) {
    super(message || 'Insuficient item quantity')
  }
}
