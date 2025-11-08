import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

import { defineGlobalsInjections } from '@ngneat/spectator';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { FormsModule } from '@angular/forms';

setupZoneTestEnv();

defineGlobalsInjections({
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  imports: [HttpClientModule, FormsModule],
});
