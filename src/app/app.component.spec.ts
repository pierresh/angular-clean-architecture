import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory(AppComponent);

  beforeEach(() => (spectator = createComponent({})));

  it('should create the app', () => {
    const app = spectator.fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular Clean Architecture'`, () => {
    const app = spectator.fixture.componentInstance;
    expect(app.title).toEqual('Angular Clean Architecture');
  });
});
