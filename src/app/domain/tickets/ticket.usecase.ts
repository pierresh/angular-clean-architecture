import { Injectable } from '@angular/core';
import { TicketState } from './ticket.state';
import { Ticket } from './ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketUsecase {
  constructor(public state: TicketState) {}

  browseItems(options?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.state.browse(options).subscribe((r) => {
        if (r.data.pageIndex === 1) {
          this.state.tiles = r.data.items;
        } else {
          this.state.tiles = this.state.tiles.concat(r.data.items);
        }

        resolve(true);
      });
    });
  }

  openItem(id: Ticket['id']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.state.read(id).subscribe((r) => {
        this.state.item = r.data.item;

        resolve(true);
      });
    });
  }

  newItem(): void {
    this.state.item = new Ticket();
  }

  saveItem(): Promise<'added' | 'updated'> {
    return new Promise((resolve, reject) => {
      if (this.state.item.id === null) {
        this.state.add().subscribe((r) => {
          this.state.item.id = r.data.id;

          this.state.addTile();
          resolve('added');
        });
      } else {
        this.state.update().subscribe((r) => {
          this.state.updateTile();
          resolve('updated');
        });
      }
    });
  }

  deleteItem(): Promise<Ticket['id']> {
    return new Promise((resolve, reject) => {
      const next_id = this.state.nextTile();

      this.state.delete().subscribe((r) => {
        this.state.deleteTile();
        resolve(next_id);
      });
    });
  }
}
