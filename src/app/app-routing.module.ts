import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './page404/page404.component';
import { AuthGuard } from './guards/auth.guard';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
   
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate : [AuthGuard], data : {roles :['SimpleUser']}

      },
      {
        path: 'businesspartners',
        loadChildren: () =>
          import('./business-partners/business-partners-routing.module').then((m) => m.BusinessPartnersRoutingModule),
        canActivate : [AuthGuard], data : {roles :['SimpleUser']}

      },

      {
        path: 'connectionpoints',
        loadChildren: () =>
          import('./connection-points/connection-points-routing.module').then((m) => m.ConnectionPointsRoutingModule),
        canActivate : [AuthGuard], data : {roles :['SimpleUser']}

      },

      {
        path: 'contracts',
        loadChildren: () =>
          import('./contracts/contracts-routing.module').then((m) => m.ContractsRoutingModule),
        canActivate : [AuthGuard], data : {roles :['SimpleUser']}

      },
      {
        path: 'sensors',
        loadChildren: () =>
          import('./sensors/sensors-routing.module').then((m) => m.SensorsRoutingModule),
        canActivate : [AuthGuard], data : {roles :['SimpleUser']}

      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: {
      title: 'Unauthorized'
    }
  },
  { path: '**', redirectTo: '404' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      //initialNavigation: 'enabledBlocking' // this was causing an infinite redirect loop
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
