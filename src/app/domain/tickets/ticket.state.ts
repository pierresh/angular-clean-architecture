import { Observable, finalize, switchMap, of, firstValueFrom } from 'rxjs';

import { TicketPorts } from './ticket.port';
import { TicketStore, Ticket } from './ticket.store';

export class TicketState {
  constructor(
    private adapter: TicketPorts,
    private store: TicketStore,
  ) {}

  browse(options?: object): Observable<{ result: boolean }> {
    return this.adapter.browse(options).pipe(
      switchMap((r) => {
        if (r.data.pageIndex === 1) {
          this.store.tiles.set(r.data.items);
        } else {
          // concatenate to the existing ones
          this.store.tiles.set([...this.store.tiles(), ...r.data.items]);
        }

        return of({ result: true });
      }),
    );
  }

  read(id: Ticket['id']): Observable<{ result: boolean }> {
    return this.adapter.read(id).pipe(
      switchMap((r) => {
        this.store.item = r.data.item;

        return of({ result: true });
      }),
    );
  }

  clean(): void {
    this.store.item = new Ticket();
  }

  saveItem(): Promise<{ result: 'added' | 'updated'; id: Ticket['id'] }> {
    if (this.store.item.id === null) {
      return firstValueFrom(
        this.add().pipe(
          switchMap(() => {
            const result = 'added' as const;

            return of({ result, id: this.store.item.id });
          }),
        ),
      );
    } else {
      return firstValueFrom(
        this.update().pipe(
          switchMap(() => {
            const result = 'updated' as const;

            return of({ result, id: this.store.item.id });
          }),
        ),
      );
    }
  }

  add(): Observable<undefined> {
    this.store.saving.set(true);

    return this.adapter.add(this.store.item).pipe(
      finalize(() => {
        this.store.saving.set(false);
      }),
      switchMap((r) => {
        this.store.item.id = r.data.id;
        this.addTile();

        return of(undefined);
      }),
    );
  }

  update(): Observable<undefined> {
    this.store.saving.set(true);

    return this.adapter.update(this.store.item).pipe(
      finalize(() => {
        this.store.saving.set(false);
      }),
      switchMap(() => {
        this.updateTile();

        return of(undefined);
      }),
    );
  }

  delete(): Observable<{ next_id: Ticket['id'] }> {
    const next_id = this.nextTile();

    this.store.deleting.set(true);

    return this.adapter.delete(this.store.item.id).pipe(
      finalize(() => {
        this.store.deleting.set(false);
      }),
      switchMap(() => {
        this.deleteTile();

        return of({ next_id });
      }),
    );
  }

  /** Determine which ticket should be displayed after we delete the current one */
  private nextTile(): Ticket['id'] {
    const itemIndex = this.store
      .tiles()
      .findIndex((item) => item.id === this.store.item.id);

    // If the item is the last one, we should use the previous one
    if (itemIndex + 1 === this.store.tiles().length) {
      if (this.store.tiles()[itemIndex - 1] !== undefined) {
        return this.store.tiles()[itemIndex - 1].id;
      }

      return 0;
    }

    // Otheriwse returns the following one
    return this.store.tiles()[itemIndex + 1].id;
  }

  /** Add a new entry in the list of tickets, ie. when a ticket is created */
  private addTile(): void {
    this.store.tiles().push({
      id: Number(this.store.item.id),
      name: this.store.item.name,
    });
  }

  /** Update the entry in the list of tickets, ie. when a ticket is updated */
  private updateTile(): void {
    const itemIndex = this.store
      .tiles()
      .findIndex((item) => item.id === this.store.item.id);

    if (itemIndex !== -1) {
      this.store.tiles()[itemIndex].name = this.store.item.name;
    }
  }

  /** Remove the tile of the deleted ticket */
  private deleteTile(): void {
    this.store.tiles.set(
      this.store.tiles().filter((i) => i.id !== this.store.item.id),
    );
  }
}
