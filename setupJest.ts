import 'jest-preset-angular/setup-jest';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

import { FormsModule } from '@angular/forms';

defineGlobalsInjections({
	providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
	imports: [HttpClientModule, AppRoutingModule, FormsModule],
});
