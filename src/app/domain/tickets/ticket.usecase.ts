import { firstValueFrom } from 'rxjs';

import { TicketState } from './ticket.state';
import { Ticket } from './ticket.model';

export class TicketUsecase {
  constructor(private state: TicketState) {}

  browseItems(options?: object): Promise<{ result: boolean }> {
    return firstValueFrom(this.state.browse(options));
  }

  openItem(id: Ticket['id']): Promise<{ result: boolean }> {
    return firstValueFrom(this.state.read(id));
  }

  newItem(): void {
    this.state.clean();
  }

  saveItem(): Promise<{ result: 'added' | 'updated'; id: Ticket['id'] }> {
    return this.state.saveItem();
  }

  deleteItem(): Promise<{ next_id: Ticket['id'] }> {
    return firstValueFrom(this.state.delete());
  }
}
