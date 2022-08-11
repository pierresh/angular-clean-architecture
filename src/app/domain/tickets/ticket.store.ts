import { Ticket, TicketTile } from './ticket.model';

export { Ticket, TicketTile } from './ticket.model';

export class TicketStore {
  item = new Ticket();
  tiles: TicketTile[] = [];

  // States for buttons
  saving = false;
  deleting = false;

  constructor() {}
}
