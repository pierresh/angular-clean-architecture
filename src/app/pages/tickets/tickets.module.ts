import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Dependency if use the real service requiring http
// If so, HttpClient should be add in the factory of TicketService
import { HttpClient } from '@angular/common/http';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketService } from '../../adapters/tickets/ticket.service.mock';
import { TicketState } from '../../domain/tickets/ticket.state';
import { TicketUsecase } from '../../domain/tickets/ticket.usecase';

@NgModule({
  declarations: [],
  imports: [CommonModule, TicketsRoutingModule],
  providers: [
    {
      provide: TicketState,
      deps: [TicketService],
      useFactory: (service: TicketService) => new TicketState(service),
    },
    {
      provide: TicketUsecase,
      deps: [TicketState],
      useFactory: (state: TicketState) => new TicketUsecase(state),
    },
  ],
})
export class TicketsModule {}
