import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
 * Service that can be used if APIs are available
 * Otherwise use ticket.service.mock instead
 */
@Injectable({
  providedIn: 'root',
})
export class TicketAdapter implements TicketPorts {
  constructor(private http: HttpClient) {}

  browse(options?: any): Observable<JsonBrowse> {
    const params = new URLSearchParams();
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        params.set(key, options[key]);
      }
    }

    return this.http.get<JsonBrowse>('api/v1/tickets?' + params.toString());
  }

  read(id: Ticket['id']): Observable<JsonRead> {
    return this.http.get<JsonRead>('api/v1/tickets/' + id);
  }

  add(item: Ticket): Observable<JsonAdd> {
    return this.http.post<JsonAdd>('api/v1/tickets', item);
  }

  update(item: Ticket): Observable<JsonUpdate> {
    return this.http.put<JsonUpdate>('api/v1/tickets/' + item.id, item);
  }

  delete(id: Ticket['id']): Observable<JsonDelete> {
    return this.http.delete<JsonDelete>('api/v1/tickets/' + id);
  }
}
