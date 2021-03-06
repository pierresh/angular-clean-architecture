import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket } from '../../domain/tickets/ticket.model';
import { TicketPorts } from '../../domain/tickets/ticket.port';

/**
 * Service that can be used if APIs are available
 * Otherwise use ticket.service.mock instead
 */
@Injectable({
  providedIn: 'root',
})
export class TicketService implements TicketPorts {
  constructor(private http: HttpClient) {}

  browse(options?: any): Observable<any> {
    const params = new URLSearchParams();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        params.set(key, options[key]);
      }
    }

    return this.http.get('api/v1/tickets?' + params.toString());
  }

  read(id: Ticket['id']): Observable<any> {
    return this.http.get<Ticket>('api/v1/tickets/' + id);
  }

  add(item: Ticket): Observable<any> {
    return this.http.post<Ticket>('api/v1/tickets', item);
  }

  update(item: Ticket): Observable<any> {
    return this.http.put<Ticket>('api/v1/tickets/' + item.id, item);
  }

  delete(id: Ticket['id']): Observable<any> {
    return this.http.delete<any>('api/v1/tickets/' + id);
  }
}
