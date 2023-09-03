import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  JsonBrowse,
  JsonRead,
  JsonAdd,
  JsonUpdate,
  JsonDelete,
} from '../response.model';

import { Ticket, TicketTile } from '../../domain/tickets/ticket.model';
import { TicketPorts } from '../../domain/tickets/ticket.port';

/**
 * Service that can be used if HttpClient cannot be used
 * for testing per example if teh back-end is not ready
 */
@Injectable({
  providedIn: 'root',
})
export class TicketAdapterMock implements TicketPorts {
  constructor() {}

  fakeTickets: TicketTile[] = [
    { id: 1, name: 'First ticket' },
    { id: 2, name: 'Second ticket' },
  ];

  fakeId = 2;

  browse(options?: any): Observable<JsonBrowse> {
    const copies = Object.assign([], this.fakeTickets); // Prevent data binding
    return of({
      data: {
        pageIndex: 1,
        items: copies,
      },
    });
  }

  read(id: Ticket['id']): Observable<JsonRead> {
    const item = this.fakeTickets.find((i) => i.id === id);
    const copy = Object.assign({}, item); // Prevent data binding

    return of({ data: { item: copy } });
  }

  add(item: Ticket): Observable<JsonAdd> {
    this.fakeId = this.fakeId + 1;

    this.fakeTickets.push({
      id: this.fakeId,
      name: item.name,
    });
    return of({ data: { id: this.fakeId } });
  }

  update(item: Ticket): Observable<JsonUpdate> {
    return of({ data: { rowCount: 1 } });
  }

  delete(id: Ticket['id']): Observable<JsonDelete> {
    return of({ data: { rowCount: 1 } });
  }
}
