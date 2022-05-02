import { Spectator, createComponentFactory, byText } from '@ngneat/spectator';
import { TicketsComponent } from './tickets.component';
import { TicketService } from '../../adapters/tickets/ticket.service.mock';
import { TicketState } from '../../domain/tickets/ticket.state';
import { TicketUsecase } from '../../domain/tickets/ticket.usecase';

import { FormsModule } from '@angular/forms';

describe('TicketComponent', () => {
  let spectator: Spectator<TicketsComponent>;

  const createComponent = createComponentFactory({
    detectChanges: false,
    component: TicketsComponent,
    imports: [FormsModule],
    providers: [
      {
        provide: TicketState,
        deps: [TicketService],
        useFactory: (service: TicketService) => new TicketState(service),
      },
      {
        provide: TicketUsecase,
        deps: [TicketState],
        useFactory: (state: TicketState) => new TicketUsecase(state),
      },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', async () => {
    expect(spectator.component).toBeTruthy();

    /** Test button New **/
    // Given I have content in ticket name
    spectator.typeInElement('11', 'input[name="name"]');

    // When I click on button new
    spectator.click('button[data-cy="button-new"]');

    // Then the ticket name should be empty
    expect(spectator.component.tickets.state.item.name).toEqual('');
    expect('input[name="name"]').toHaveValue('');

    /** Test button Save - Create **/
    // Given I have content in ticket name
    spectator.typeInElement('New ticket', 'input[name="name"]');

    // When I click on save
    spectator.click('button[data-cy="button-save"]');
    await spectator.fixture.whenStable();

    // Then I should get a new ticket id
    expect('input[name="id"]').toHaveValue('3');

    // It should have 3 tiles
    expect('div[data-cy="tiles"] a').toHaveLength(3);

    /** Test button Save - Update **/
    // Give I update the ticket name
    spectator.typeInElement('New ticket updated', 'input[name="name"]');

    // When I click on save
    spectator.click('button[data-cy="button-save"]');
    await spectator.fixture.whenStable();

    // Then it should still have 3 tiles
    expect('div[data-cy="tiles"] a').toHaveLength(3);

    /** Test button Delete **/
    // When I click on delete
    spectator.click('button[data-cy="button-delete"]');
    await spectator.fixture.whenStable();

    // Then it should still have 2 tiles
    expect('div[data-cy="tiles"] a').toHaveLength(2);
  });
});
