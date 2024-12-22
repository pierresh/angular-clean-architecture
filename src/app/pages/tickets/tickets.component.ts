import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  ParamMap,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';

import { environment } from 'src/environments/environment';

import { TicketUsecase } from '../../domain/tickets/ticket.usecase';
import { TicketStore, Ticket } from '../../domain/tickets/ticket.store';

import { TicketState } from 'src/app/domain/tickets/ticket.state';
import { TicketAdapter } from 'src/app/adapters/tickets/ticket.adapter';
import { TicketAdapterMock } from 'src/app/adapters/tickets/ticket.adapter.mock';

@Component({
  standalone: true,
  selector: 'app-ticket',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  imports: [RouterLinkActive, RouterLink, FormsModule],
  providers: [
    {
      provide: TicketStore,
      useFactory: () => new TicketStore(),
    },
    {
      provide: TicketState,
      deps: [TicketAdapter, TicketAdapterMock, TicketStore],
      useFactory: (
        adapter: TicketAdapter,
        adapterMock: TicketAdapterMock,
        store: TicketStore,
      ): TicketState => {
        if (environment.api_source === 'rest') {
          return new TicketState(adapter, store);
        } else {
          return new TicketState(adapterMock, store);
        }
      },
    },
    {
      provide: TicketUsecase,
      deps: [TicketState],
      useFactory: (state: TicketState) => new TicketUsecase(state),
    },
  ],
})
export class TicketsComponent implements OnInit {
  @ViewChild('ticket_name') ticket_name!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usecase: TicketUsecase,
    public store: TicketStore,
  ) {}

  ngOnInit(): void {
    // Load the tiles
    this.usecase.browseItems().then(() => {
      // If the route id is empty, we set it as the first item in tiles
      const route_id = this.route.snapshot.paramMap.get('id');
      if (route_id === null || route_id === '.') {
        this.navigate(this.store.tiles()[0].id);
      }

      // Listen the change of the route to load the related ticket
      // It will load the one set in the route just after
      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.get('id') !== null && params.get('id') !== '.') {
          const id = Number(params.get('id'));
          this.openItem(id);
        }
      });
    });
  }

  openItem(id: number): void {
    this.usecase.openItem(id);
  }

  newItem(): void {
    this.usecase.newItem();
    this.ticket_name.nativeElement.focus();
  }

  saveItem(): void {
    this.usecase.saveItem().then((r) => {
      if (r.result === 'added') {
        this.navigate(r.id);
      }
    });
  }

  deleteItem(): void {
    this.usecase.deleteItem().then((r) => {
      if (r.next_id === 0) {
        this.usecase.newItem();
      } else {
        this.navigate(r.next_id);
      }
    });
  }

  private navigate(id: Ticket['id']): void {
    this.router.navigate(['/tickets', id]);
  }
}
