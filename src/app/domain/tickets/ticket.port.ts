import { Observable } from 'rxjs';

import { JsonBrowse } from '../../adapters/response.model';

import { Ticket, TicketTile } from './ticket.model';

export interface TicketPorts<> {
  browse(options?: object): Observable<JsonBrowse<TicketTile>>;

  read(id: Ticket['id']): Observable<{
    data: {
      item: Ticket;
    };
  }>;

  add(item: Ticket): Observable<{
    data: {
      id: number;
    };
  }>;

  update(item: Ticket): Observable<{
    data: {
      rowCount: number;
    };
  }>;

  delete(id: Ticket['id']): Observable<{
    data: {
      rowCount: number;
    };
  }>;
}
