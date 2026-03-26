import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Apply } from './apply/apply';
import { JobOffers } from './job-offers/job-offers';

const routes: Routes = [
  { path: '', component: JobOffers},
  { path: 'job-offers', component: JobOffers},
  { path: 'apply/:id', component: Apply}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
