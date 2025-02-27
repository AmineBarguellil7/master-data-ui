import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessPartnersComponent } from './business-partners.component';
import { GetBusinessPartnerComponent } from './get-business-partner/get-business-partner.component'


const routes: Routes = [
  {
    path: '',
    component: BusinessPartnersComponent,
    data: {
      title: `Business Partners`,
    }
  },
  {
    path: 'add',
    component: GetBusinessPartnerComponent,
    data: {
      title: `Add Business Partner`,
    }

  },

  {
    path: ':id',
    component: GetBusinessPartnerComponent,
    data: {
      title: `Business Partner`,
    }

  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessPartnersRoutingModule {
}
