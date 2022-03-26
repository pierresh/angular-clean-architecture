# Angular Clean Architecture

This project aims to be a skeleton for a [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) implemented with Angular.

This example shows a management of tickets, each of them having an id and a name.

Tests are done with [Jest](https://jestjs.io/) and [Spectator](https://ngneat.github.io/spectator/)

If you have any suggestion to improve this skeleton, feel free to open an [Issue](https://github.com/pierresh/angular-clean-architecture/issues/new) or a *Pull request* :)

## Advantages
- fully tested (ideally though a TDD approach)
- the front-end can be developped without APIs/back-end thanks to the [in-memory service](https://github.com/pierresh/angular-clean-architecture/blob/main/src/app/domain/tickets/ticket.service.mock.ts)
- the code is divided by layer, one by concern
- the business logic is independent from the component, so it is easy to update the UI without impacting the business logic

![examples](src/assets/tickets.png)

## Rationale
- domain files are gathered in one folder per topic in [src/app/domain](https://github.com/pierresh/angular-clean-architecture/tree/main/src/app), including:
    - model.ts
    - service.ts
    - state.ts
    - usecase.ts
- the component interacts only with the use case class
- for the sake of simplicity, the use case class gathers the different use cases for that topic
- unit tests are performed only through the use cases (as they will use the necessary files to perform the required actions, so it is enough to assert their behavior)
- integration tests are performed on the component and on the http service
- 2 services are provided, the original one using HttpClient, and an in-memory one for mock (used by default)

## Development server
Run `npm i` to install dependencies.

Then `ng serve --open` for a dev server.

## Running unit tests

Run `jest` to execute the unit tests

