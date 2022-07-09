import { TicketState } from './ticket.state';
import { Ticket, TicketTile } from './ticket.model';
import { Observable, of } from 'rxjs';

export class TicketUsecase {
  constructor(public state: TicketState) {}

  getTiles(): Observable<TicketTile[]> {
    return of(this.state.tiles);
  }

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
    this.state.clean();
  }

  saveItem(): Promise<{ result: 'added' | 'updated'; id: Ticket['id'] }> {
    return new Promise((resolve, reject) => {
      if (this.state.item.id === null) {
        this.state.add().subscribe((r) => {
          resolve({ result: 'added', id: this.state.item.id });
        });
      } else {
        this.state.update().subscribe((r) => {
          resolve({ result: 'updated', id: this.state.item.id });
        });
      }
    });
  }

  deleteItem(): Promise<{ next_id: Ticket['id'] }> {
    return new Promise((resolve, reject) => {
      this.state.delete().subscribe((next_id) => {
        resolve({ next_id });
      });
    });
  }
}
