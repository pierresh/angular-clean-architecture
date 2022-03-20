import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsComponent } from './tickets.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '.' },
      { path: ':id', component: TicketsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
