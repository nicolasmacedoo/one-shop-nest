import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

// simulando um agregado da aplicação (ex: Order)
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // registra o callback para o evento CustomAggregateCreated
    // subscriber cadastrado (estou ouvindo o evento "pedido criado" (CustomAggregateCreated) )
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // estou criando uma resposta porem SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // verifica se o evento foi adicionado
    // o evento foi adicionado no array de eventos do agregado
    // Estou assegurando que o evendo foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando o pedido no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // verifica se o callback foi chamado
    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(callbackSpy).toHaveBeenCalledTimes(1)
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
