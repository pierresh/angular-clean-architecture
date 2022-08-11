import { Observable, finalize, switchMap, of } from 'rxjs';

// You can use './ticket.service' if your APis are ready, otherwise use './ticket.service.mock'
import { TicketService } from '../../adapters/tickets/ticket.service.mock';
import { TicketStore, Ticket, TicketTile } from './ticket.store';

export class TicketState {
  constructor(private service: TicketService, private store: TicketStore) {}

  browse(options?: any): Observable<any> {
    return this.service.browse(options).pipe(
      switchMap((r) => {
        if (r.data.pageIndex === 1) {
          this.store.tiles = r.data.items;
        } else {
          this.store.tiles = this.store.tiles.concat(r.data.items);
        }

        return of(r);
      })
    );
  }

  read(id: Ticket['id']): Observable<any> {
    return this.service.read(id).pipe(
      switchMap((r) => {
        this.store.item = r.data.item;

        return of(r);
      })
    );
  }

  clean(): void {
    this.store.item = new Ticket();
  }

  saveItem(): Promise<{ result: 'added' | 'updated'; id: Ticket['id'] }> {
    return new Promise((resolve, reject) => {
      if (this.store.item.id === null) {
        this.add().subscribe((r) => {
          resolve({ result: 'added', id: this.store.item.id });
        });
      } else {
        this.update().subscribe((r) => {
          resolve({ result: 'updated', id: this.store.item.id });
        });
      }
    });
  }

  add(): Observable<any> {
    this.store.saving = true;

    return this.service.add(this.store.item).pipe(
      finalize(() => {
        this.store.saving = false;
      }),
      switchMap((r) => {
        this.store.item.id = r.data.id;
        this.addTile();

        return of(r);
      })
    );
  }

  update(): Observable<any> {
    this.store.saving = true;

    return this.service.update(this.store.item).pipe(
      finalize(() => {
        this.store.saving = false;
      }),
      switchMap((r) => {
        this.updateTile();

        return of(r);
      })
    );
  }

  delete(): Observable<Ticket['id']> {
    const next_id = this.nextTile();
    this.store.deleting = true;
    return this.service.delete(this.store.item.id).pipe(
      finalize(() => {
        this.store.deleting = false;
      }),
      switchMap((r) => {
        this.deleteTile();

        return of(next_id);
      })
    );
  }

  /** Determine which ticket should be displayed after we delete the current one */
  nextTile(): Ticket['id'] {
    const itemIndex = this.store.tiles.findIndex(
      (item) => item.id === this.store.item.id
    );

    // If the item is the last one, we should use the previous one
    if (itemIndex + 1 === this.store.tiles.length) {
      if (this.store.tiles[itemIndex - 1] !== undefined) {
        return this.store.tiles[itemIndex - 1].id;
      }

      return 0;
    }

    // Otheriwse returns the following one
    return this.store.tiles[itemIndex + 1].id;
  }

  /** Add a new entry in the list of tickets, ie. when a ticket is created */
  addTile(): void {
    this.store.tiles.push({
      id: Number(this.store.item.id),
      name: this.store.item.name,
    });
  }

  /** Update the entry in the list of tickets, ie. when a ticket is updated */
  updateTile(): void {
    const itemIndex = this.store.tiles.findIndex(
      (item) => item.id === this.store.item.id
    );

    if (itemIndex !== -1) {
      this.store.tiles[itemIndex].name = this.store.item.name;
    }
  }

  /** Remove the tile of the deleted ticket */
  deleteTile(): void {
    this.store.tiles = this.store.tiles.filter(
      (i) => i.id !== this.store.item.id
    );
  }
}
