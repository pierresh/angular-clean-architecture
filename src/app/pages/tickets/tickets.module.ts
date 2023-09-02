import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Dependency if use the real service requiring http
// If so, HttpClient should be add in the factory of TicketAdapter
import { HttpClient } from '@angular/common/http';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketAdapter } from '../../adapters/tickets/ticket.adapter';
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
      deps: [TicketAdapter, TicketStore],
      useFactory: (adapter: TicketAdapter, store: TicketStore) =>
        new TicketState(adapter, store),
    },
    {
      provide: TicketUsecase,
      deps: [TicketState],
      useFactory: (state: TicketState) => new TicketUsecase(state),
    },
  ],
})
export class TicketsModule {}
