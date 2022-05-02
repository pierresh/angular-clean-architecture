import { TicketState } from './ticket.state';
import { Ticket } from './ticket.model';

export class TicketUsecase {
  constructor(public state: TicketState) {}

  browseItems(options?: any): Promise<object> {
    return new Promise((resolve, reject) => {
      this.state.browse(options).subscribe((r) => {
        resolve({ result: true });
      });
    });
  }

  openItem(id: Ticket['id']): Promise<object> {
    return new Promise((resolve, reject) => {
      this.state.read(id).subscribe((r) => {
        resolve({ result: true });
      });
    });
  }

  newItem(): void {
    this.state.item = new Ticket();
  }

  saveItem(): Promise<{ result: 'added' | 'updated'}> {
    return new Promise((resolve, reject) => {
      if (this.state.item.id === null) {
        this.state.add().subscribe((r) => {
          resolve({ result: 'added' });
        });
      } else {
        this.state.update().subscribe((r) => {
          resolve({ result: 'updated' });
        });
      }
    });
  }

  deleteItem(): Promise<{ next_id: Ticket['id']}> {
    return new Promise((resolve, reject) => {
      this.state.delete().subscribe((next_id) => {
        resolve({ next_id });
      });
    });
  }
}
