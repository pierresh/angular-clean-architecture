import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TicketsComponent } from './pages/tickets/tickets.component';

@NgModule({
  declarations: [AppComponent, TicketsComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
