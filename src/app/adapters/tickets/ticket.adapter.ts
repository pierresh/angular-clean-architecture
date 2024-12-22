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

  browse(options: object): Observable<JsonBrowse<TicketTile>> {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    return this.http.get<JsonBrowse<TicketTile>>(
      'api/v1/tickets?' + params.toString(),
    );
  }

  read(id: Ticket['id']): Observable<JsonRead<Ticket>> {
    return this.http.get<JsonRead<Ticket>>('api/v1/tickets/' + id);
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
