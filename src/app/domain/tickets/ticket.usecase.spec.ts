import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { TicketUsecase } from './ticket.usecase';

const serviceMock = {
  item: {},
  tiles: [],
  browse: () =>
    of({
      data: {
        pageIndex: 1,
        items: [
          { id: 1, name: 'First ticket' },
          { id: 2, name: 'Second ticket' },
        ],
      },
    }),
  read: () =>
    of({
      data: {
        item: { id: 1, name: 'First ticket' },
      },
    }),
  add: () => of({ data: { id: 3 } }),
  update: () => of({ data: { rowCount: 1 } }),
  delete: () => of({ data: { rowCount: 1 } }),
};

describe('TicketUsecase', () => {
  let spectator: SpectatorService<TicketUsecase>;

  const createService = createServiceFactory(TicketUsecase);

  beforeEach(() => (spectator = createService()));

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
    const usecase = spectator.service;

    // When I browse ths list of tickets
    usecase.browseItems();

    // Then I should have 2 tickets
    expect(usecase.state.tiles.length).toEqual(2);

    // When I open the first tile
    usecase.openItem(1);

    // Then the ticket name should be equal to 'First ticket'
    expect(usecase.state.item.name).toEqual('First ticket');

    // Given I set the ticket name
    usecase.state.item.name = 'Hello';

    // When I call newItem()
    usecase.newItem();

    // Then the ticket name shoud be empty
    expect(usecase.state.item.name).toEqual('');

    // Given I write a ticket name
    usecase.state.item.name = 'Hello';

    // When I call saveItem()
    usecase.saveItem();

    // Then it adds the ticket in the list
    expect(usecase.state.tiles.length).toEqual(3);

    // Given I update the ticket name
    usecase.state.item.name = 'Hello2';

    // When I call saveItem()
    usecase.saveItem();

    // Then it should still have one tile in the list of tiles
    expect(usecase.state.tiles.length).toEqual(3);

    // And it should update the name of the tile
    const obj = usecase.state.tiles.find((i) => i.id === 3);
    expect(obj).toBeDefined();

    if (obj) {
      expect(obj.name).toEqual('Hello2');
    }

    // When I delete the current ticket
    usecase.deleteItem().then((r) => {
      // Then the next ticket_id should be equal to 2
      expect(r.next_id).toEqual(2);
    });

    // And the list of tiles should be empty
    expect(usecase.state.tiles.length).toEqual(2);
  });
});
