import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { TicketUsecase } from '../../domain/tickets/ticket.usecase';
import { TicketStore } from '../../domain/tickets/ticket.store';

@Component({
  selector: 'app-ticket',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  @ViewChild('ticket_name') ticket_name!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usecase: TicketUsecase,
    public store: TicketStore
  ) {}

  ngOnInit(): void {
    // Load the tiles
    this.usecase.browseItems().then((r) => {
      // If the route id is empty, we set it as the first item in tiles
      const route_id = this.route.snapshot.paramMap.get('id');
      if (route_id === null || route_id === '.') {
        this.router.navigate(['/tickets', this.store.tiles[0].id]);
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
        this.router.navigate(['/tickets', r.id]);
      }
    });
  }

  deleteItem(): void {
    this.usecase.deleteItem().then((r) => {
      if (r.next_id === 0) {
        this.usecase.newItem();
      } else {
        this.router.navigate(['/tickets', r.next_id]);
      }
    });
  }
}
