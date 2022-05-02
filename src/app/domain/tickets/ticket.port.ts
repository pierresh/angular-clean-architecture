import { Observable } from 'rxjs';

import { Ticket } from './ticket.model';

export interface TicketPorts<> {
  browse(options?: any): Observable<any>;

  read(id: Ticket['id']): Observable<any>;

  add(item: Ticket): Observable<any>;

  update(item: Ticket): Observable<any>;

  delete(id: Ticket['id']): Observable<any>;
}
