import {
  createHttpFactory,
  SpectatorHttp,
  HttpMethod,
} from '@ngneat/spectator';

import { TicketService } from './ticket.service';

describe('HttpClient testing for TicketService', () => {
  let spectator: SpectatorHttp<TicketService>;
  const createHttp = createHttpFactory(TicketService);

  beforeEach(() => (spectator = createHttp()));

  it('can test HttpClient.get', () => {
    // When I browse tickets without parameters
    spectator.service.browse().subscribe();

    // Then it should call the API GET api/v1/tickets?
    spectator.expectOne('api/v1/tickets?', HttpMethod.GET);

    // When I browse tickets with a parameter for page 1 and for q as 'my text'
    spectator.service.browse({ p: 1, q: 'my text' }).subscribe();

    // Then it should call the API GET api/v1/tickets?p=1&q=my+text
    spectator.expectOne('api/v1/tickets?p=1&q=my+text', HttpMethod.GET);

    // When I want to load the ticket 1
    spectator.service.read(1).subscribe();

    // Then it should call the API GET api/v1/tickets/1
    spectator.expectOne('api/v1/tickets/1', HttpMethod.GET);

    // When I want to load the ticket 3
    spectator.service.read(3).subscribe();

    // Then it should call the API GET api/v1/tickets/3
    spectator.expectOne('api/v1/tickets/3', HttpMethod.GET);
  });

  it('can test HttpClient.post', () => {
    // When I post a new ticket
    spectator.service.add({ id: null, name: 'my new ticket' }).subscribe();

    // Then it should call the API POST api/v1/tickets
    const req = spectator.expectOne('api/v1/tickets', HttpMethod.POST);

    // And the body should have a data 'name' with the value 'my new ticket'
    expect(req.request.body['name']).toEqual('my new ticket');
  });

  it('can test HttpClient.put', () => {
    // When I update an existing ticket
    spectator.service.update({ id: 1, name: 'my ticket updated' }).subscribe();

    // Then it should call the API api/v1/tickets/1
    const req = spectator.expectOne('api/v1/tickets/1', HttpMethod.PUT);

    // And the body should have a data 'name' with the value 'my ticket updated'
    expect(req.request.body['name']).toEqual('my ticket updated');
  });

  it('can test HttpClient.delete', () => {
    // When I delete an existing ticket
    spectator.service.delete(1).subscribe();

    // Then it should call the API api/v1/tickets/1
    spectator.expectOne('api/v1/tickets/1', HttpMethod.DELETE);
  });
});
