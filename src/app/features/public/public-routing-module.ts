import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Apply } from './apply/apply';
import { JobOffers } from './job-offers/job-offers';
import { About } from './about/about';
import { Contact } from './contact/contact';

const routes: Routes = [
  { path: '', component: About},
  { path: 'about', component: About},
  { path: 'job-offers', component: JobOffers},
  { path: 'contact', component: Contact},
  { path: 'apply/:id', component: Apply}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
