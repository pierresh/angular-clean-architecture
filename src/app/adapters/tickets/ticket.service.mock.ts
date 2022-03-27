import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Ticket } from '../../domain/tickets/ticket.model';
import { TicketServices } from '../../domain/tickets/ticket.port';

/**
 * Service that can be used if HttpClient cannot be used
 * for testing per example if teh back-end is not ready
 */
@Injectable({
  providedIn: 'root',
})
export class TicketService implements TicketServices {
  constructor() {}

  fakeTickets: Ticket[] = [
    { id: 1, name: 'First ticket' },
    { id: 2, name: 'Second ticket' },
  ];

  fakeId = 2;

  browse(options?: any): Observable<any> {
    const copies = Object.assign([], this.fakeTickets); // Prevent data binding
    return of({
      data: {
        pageIndex: 1,
        items: copies,
      },
    });
  }

  read(id: Ticket['id']): Observable<any> {
    const item = this.fakeTickets.find((i) => i.id === id);
    const copy = Object.assign({}, item); // Prevent data binding

    return of({ data: { item: copy } });
  }

  add(item: Ticket): Observable<any> {
    this.fakeId = this.fakeId + 1;

    this.fakeTickets.push({
      id: this.fakeId,
      name: item.name,
    });
    return of({ data: { id: this.fakeId } });
  }

  update(item: Ticket): Observable<any> {
    return of({ data: { rowCount: 1 } });
  }

  delete(id: Ticket['id']): Observable<any> {
    return of({ data: { rowCount: 1 } });
  }
}
