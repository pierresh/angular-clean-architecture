import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Dependency if use the real service requiring http
// If so, HttpClient should be add in the factory of TicketService
import { HttpClient } from '@angular/common/http';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketService } from '../../adapters/tickets/ticket.service.mock';
import { TicketState } from '../../domain/tickets/ticket.state';
import { TicketStore } from '../../domain/tickets/ticket.store';
import { TicketUsecase } from '../../domain/tickets/ticket.usecase';

@NgModule({
  declarations: [],
  imports: [CommonModule, TicketsRoutingModule],
  providers: [
    {
      provide: TicketStore,
      useFactory: () => new TicketStore(),
    },
    {
      provide: TicketState,
      deps: [TicketService, TicketStore],
      useFactory: (service: TicketService, store: TicketStore) =>
        new TicketState(service, store),
    },
    {
      provide: TicketUsecase,
      deps: [TicketState],
      useFactory: (state: TicketState) => new TicketUsecase(state),
    },
  ],
})
export class TicketsModule {}
