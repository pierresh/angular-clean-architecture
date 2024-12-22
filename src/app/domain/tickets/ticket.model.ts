export class TicketTile {
  id: Ticket['id'];
  name: Ticket['name'];

  constructor(o?: any) {
    this.id = o?.id || null;
    this.name = o?.name || '';
  }
}

export class Ticket {
  id: number | null;
  name: string;

  constructor(o?: any) {
    this.id = o?.id || null;
    this.name = o?.name || '';
  }
}
