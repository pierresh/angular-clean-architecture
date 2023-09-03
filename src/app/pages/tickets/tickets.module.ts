import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketAdapter } from '../../adapters/tickets/ticket.adapter';
import { TicketAdapterMock } from '../../adapters/tickets/ticket.adapter.mock';
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
      deps: [TicketAdapter, TicketAdapterMock, TicketStore],
      useFactory: (
        adapter: TicketAdapter,
        adapterMock: TicketAdapterMock,
        store: TicketStore
      ): TicketState => {
        if (environment.api_source === 'rest') {
          return new TicketState(adapter, store);
        } else {
          return new TicketState(adapterMock, store);
        }
      },
    },
    {
      provide: TicketUsecase,
      deps: [TicketState],
      useFactory: (state: TicketState) => new TicketUsecase(state),
    },
  ],
})
export class TicketsModule {}
