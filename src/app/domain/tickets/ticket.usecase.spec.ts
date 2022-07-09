import { of } from 'rxjs';

import { TicketUsecase } from './ticket.usecase';
import { TicketState } from './ticket.state';
import { TicketService } from '../../adapters/tickets/ticket.service.mock';

// If there is no .service.mock available, it is possible to mock as follow
// I keep the 2 way to mock the service for record
const serviceMock = {
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
  // const service = serviceMock;
  const service = new TicketService();
  const state = new TicketState(service);
  const usecase = new TicketUsecase(state);

  it('should browseItems', () => {
    // When I browse ths list of tickets
    usecase.browseItems();

    // Then I should have 2 tickets
    expect(usecase.state.tiles.length).toEqual(2);
  });

  it('should open the first item', () => {
    // When I open the first tile
    usecase.openItem(1);

    // Then the ticket name should be equal to 'First ticket'
    expect(usecase.state.item.name).toEqual('First ticket');
  });

  it('should clean when call newItem', () => {
    // Given I set the ticket name;
    usecase.state.item.name = 'Hello';

    // When I call newItem()
    usecase.newItem();

    // Then the ticket name shoud be empty
    expect(usecase.state.item.name).toEqual('');
  });

  it('should add a tile when save an item', () => {
    // Given I write a ticket name with an id equal to null
    usecase.state.item.id = null;
    usecase.state.item.name = 'Hello';

    // When I call saveItem()
    usecase.saveItem();

    // Then it adds the ticket in the list
    expect(usecase.state.tiles.length).toEqual(3);
  });

  it('should update a tile when save an item with an id', () => {
    // Given I update the ticket name with an ID equals to 3
    usecase.state.item.id = 3;
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
  });

  it('should delete a tile when delete an item', () => {
    // When I delete the current ticket
    usecase.deleteItem().then((r) => {
      // Then the next ticket_id should be equal to 2
      expect(r.next_id).toEqual(2);
    });

    // And the list of tiles should be equal to 2
    expect(usecase.state.tiles.length).toEqual(2);
  });
});
