import { of } from 'rxjs';

import { TicketUsecase } from './ticket.usecase';
import { TicketState } from './ticket.state';
import { TicketStore } from './ticket.store';
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
  const store = new TicketStore();
  const state = new TicketState(service, store);
  const usecase = new TicketUsecase(state);

  it('should browseItems', () => {
    // When I browse ths list of tickets
    usecase.browseItems();

    // Then I should have 2 tickets
    expect(store.tiles.length).toEqual(2);
  });

  it('should add tiles when browse the second page', () => {
    // Given I have one tile
    store.tiles = [{ id: 10, name: 'Thenth' }];

    // When I browse the second page
    usecase.browseItems({ pageIndex: 2 });

    // Then I have two tiles more
    expect(store.tiles.length).toEqual(2);
  });

  it('should open the first item', () => {
    // When I open the first ticket
    usecase.openItem(1);

    // Then the ticket name should be equal to 'First ticket'
    expect(store.item.name).toEqual('First ticket');
  });

  it('should clean when call newItem', () => {
    // Given I set the ticket name;
    store.item.name = 'Hello';

    // When I call newItem()
    usecase.newItem();

    // Then the ticket name shoud be empty
    expect(store.item.name).toEqual('');
  });

  it('should add a ticket when save an item', () => {
    // Given I write a ticket name with an id equal to null
    store.item.id = null;
    store.item.name = 'Hello';

    // When I call saveItem()
    usecase.saveItem();

    // Then it adds the ticket in the list
    expect(store.tiles.length).toEqual(3);
  });

  it('should update a ticket when save an item with an id', () => {
    // Given I update the ticket name with an ID equals to 3
    store.item.id = 3;
    store.item.name = 'Hello2';

    // When I call saveItem()
    usecase.saveItem();

    // Then it should still have one ticket in the list of tickets
    expect(store.tiles.length).toEqual(3);

    // And it should update the name of the ticket
    const obj = store.tiles.find((i) => i.id === 3);
    // expect(obj).toBeDefined();

    if (obj) {
      expect(obj.name).toEqual('Hello2');
    }
  });

  it('should return the following ticket when delete current record', () => {
    // Given I have an item and one ticket
    store.item.id = 1;
    store.item.name = 'First';
    store.tiles = [
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'Second',
      },
      {
        id: 3,
        name: 'Third',
      },
    ];

    // When I delete the current item
    usecase.deleteItem().then((r) => {
      // Then the next_id should be equal to '002'
      expect(r.next_id).toEqual(2);
    });
  });

  it('should return the new last ticket when deleting the last ticket of the list', () => {
    // Given I have an item and one ticket
    store.item.id = 3;
    store.item.name = 'First';
    store.tiles = [
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'Second',
      },
      {
        id: 3,
        name: 'Third',
      },
    ];

    // When I delete the current item
    usecase.deleteItem().then((r) => {
      // Then the next_id should be equal to '002'
      expect(r.next_id).toEqual(2);
    });
  });

  it('should return 0 when delete the last remaining ticket', async () => {
    // Given I have an item and one ticket
    store.item.id = 1;
    store.item.name = 'First';
    store.tiles = [
      {
        id: 1,
        name: 'First',
      },
    ];

    // When I delete the current item
    await usecase.deleteItem().then((r) => {
      // Then the next_id should be equal to '002'
      expect(r.next_id).toEqual(0);
    });
  });
});
