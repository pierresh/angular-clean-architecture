import { Observable } from 'rxjs';

import { Ticket, TicketTile } from './ticket.model';

export interface TicketPorts<> {
  browse(options?: any): Observable<{
    data: {
      pageIndex: number;
      items: TicketTile[];
    };
  }>;

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
