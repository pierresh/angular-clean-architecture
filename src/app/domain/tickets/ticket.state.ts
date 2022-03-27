import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

// You can use './ticket.service' if your APis are ready, otherwise use './ticket.service.mock'
import { TicketService } from '../../adapters/tickets/ticket.service.mock';
import { Ticket, TicketTile } from './ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketState {
  item = new Ticket();
  tiles: TicketTile[] = [];

  // States for buttons
  saving = false;
  deleting = false;

  constructor(private service: TicketService) {}

  browse(options?: any): Observable<any> {
    return this.service.browse(options);
  }

  read(id: Ticket['id']): Observable<any> {
    return this.service.read(id);
  }

  add(): Observable<any> {
    this.saving = true;

    return this.service.add(this.item).pipe(
      finalize(() => {
        this.saving = false;
      })
    );
  }

  update(): Observable<any> {
    this.saving = true;

    return this.service.update(this.item).pipe(
      finalize(() => {
        this.saving = false;
      })
    );
  }

  delete(): Observable<Ticket['id']> {
    this.deleting = true;
    return this.service.delete(this.item.id).pipe(
      finalize(() => {
        this.deleting = false;
      })
    );
  }

  /** Determine which ticket should be displayed after we delete the current one */
  nextTile(): Ticket['id'] {
    const itemIndex = this.tiles.findIndex((item) => item.id === this.item.id);

    // If the item is the last one, we should use the previous one
    if (itemIndex + 1 === this.tiles.length) {
      if (this.tiles[itemIndex - 1] !== undefined) {
        return this.tiles[itemIndex - 1].id;
      }

      return 0;
    }

    // Otheriwse returns the following one
    return this.tiles[itemIndex + 1].id;
  }

  /** Add a new entry in the list of tickets, ie. when a ticket is created */
  addTile(): void {
    this.tiles.push({
      id: Number(this.item.id),
      name: this.item.name,
    });
  }

  /** Update the entry in the list of tickets, ie. when a ticket is updated */
  updateTile(): void {
    const itemIndex = this.tiles.findIndex((item) => item.id === this.item.id);

    if (itemIndex !== -1) {
      this.tiles[itemIndex].name = this.item.name;
    }
  }

  /** Remove the tile of the deleted ticket */
  deleteTile(): void {
    this.tiles = this.tiles.filter((i) => i.id !== this.item.id);
  }
}
