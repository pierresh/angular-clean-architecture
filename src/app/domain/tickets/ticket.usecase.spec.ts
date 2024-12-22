import { TicketUsecase as Usecase } from './ticket.usecase';
import { TicketState as State } from './ticket.state';
import { TicketStore as Store, TicketTile } from './ticket.store';
import { TicketAdapterMock as Adapter } from '../../adapters/tickets/ticket.adapter.mock';

describe('TicketUsecase', () => {
  let adapter: Adapter;
  let store: Store;
  let state: State;
  let usecase: Usecase;

  beforeEach(() => {
    adapter = new Adapter();
    store = new Store();
    state = new State(adapter, store);
    usecase = new Usecase(state);
  });

  it('should browseItems', () => {
    // When I browse ths list of tickets
    usecase.browseItems();

    // Then I should have 2 tickets
    expect(store.tiles.length).toEqual(0);
  });

  it('should add tiles when browse the second page', () => {
    // Given I have one tile
    store.tiles.set([new TicketTile({ id: 10, name: 'Thenth' })]);

    // When I browse the second page
    usecase.browseItems({ pageIndex: 2 });

    // Then I have two tiles more
    expect(store.tiles().length).toEqual(2);
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
    store.tiles.set([]);
    store.item.id = null;
    store.item.name = 'Hello';

    // When I call saveItem()
    usecase.saveItem();

    // Then it adds the ticket in the list
    expect(store.tiles().length).toEqual(1);
  });

  it('should update a ticket when save an item with an id', () => {
    // Given I update the ticket name with an ID equals to 3
    store.tiles.set([new TicketTile({ id: 3, name: 'Hello' })]);

    store.item.id = 3;
    store.item.name = 'Hello2';

    // When I call saveItem()
    usecase.saveItem();

    // Then it should still have one ticket in the list of tickets
    expect(store.tiles().length).toEqual(1);

    // And it should update the name of the ticket
    const obj = store.tiles().find((i) => i.id === 3);
    // expect(obj).toBeDefined();

    if (obj) {
      expect(obj.name).toEqual('Hello2');
    }
  });

  it('should return the following ticket when delete current record', () => {
    // Given I have an item and one ticket
    store.item.id = 1;
    store.item.name = 'First';
    store.tiles.set([
      new TicketTile({
        id: 1,
        name: 'First',
      }),
      new TicketTile({
        id: 2,
        name: 'Second',
      }),
      new TicketTile({
        id: 3,
        name: 'Third',
      }),
    ]);

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
    store.tiles.set([
      new TicketTile({
        id: 1,
        name: 'First',
      }),
      new TicketTile({
        id: 2,
        name: 'Second',
      }),
      new TicketTile({
        id: 3,
        name: 'Third',
      }),
    ]);

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
    store.tiles.set([
      new TicketTile({
        id: 1,
        name: 'First',
      }),
    ]);

    // When I delete the current item
    await usecase.deleteItem().then((r) => {
      // Then the next_id should be equal to '002'
      expect(r.next_id).toEqual(0);
    });
  });
});
