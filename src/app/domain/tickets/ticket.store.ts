import { signal } from '@angular/core';
import { Ticket, TicketTile } from './ticket.model';

export { Ticket, TicketTile } from './ticket.model';

export class TicketStore {
  item = new Ticket();
  tiles = signal<TicketTile[]>([]);

  // States for buttons
  saving = signal(false);
  deleting = signal(false);
}
