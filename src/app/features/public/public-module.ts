import { NgModule } from '@angular/core';

import { PublicRoutingModule } from './public-routing-module';
import { Apply } from './apply/apply';
import { SharedModule } from '../../shared/shared-module';
import { JobOffers } from './job-offers/job-offers';
import { About } from './about/about';
import { Contact } from './contact/contact';


@NgModule({
  declarations: [
    Apply,
    JobOffers,
    About,
    Contact,
  ],
  imports: [
    SharedModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
