import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { Apply } from './apply/apply';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { JobOfferService } from '../../core/services/recruitment/job-offer';
import { JobOffers } from './job-offers/job-offers';


@NgModule({
  declarations: [
    Apply,
    JobOffers,
  ],
  imports: [
   CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
