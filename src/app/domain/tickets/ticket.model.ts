export interface TicketTile {
  id: number;
  name: string;
}

export class Ticket {
  id: number;
  name: string;

  constructor(o?: any) {
    this.id = (o && o.id) || null;
    this.name = (o && o.name) || '';
  }
}
