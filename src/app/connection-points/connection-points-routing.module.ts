import { CpServicesComponent } from './get-connection-point/cp-services/cp-services.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectionPointsComponent } from './connection-points.component';
import { GetConnectionPointComponent } from './get-connection-point/get-connection-point.component';
import { CpConnectivityComponent } from './get-connection-point/cp-connectivity/cp-connectivity.component';
import { CpSensorsComponent } from './get-connection-point/cp-sensors/cp-sensors.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ConnectionPointsComponent,
    data: {
      title: `Connection Points`,
    }

  },
  {
    path: 'add',
    component: GetConnectionPointComponent,
    data: {
      title: ` Add Connection Point`,
    },
  },
  {
    path: 'add/:bpId',
    component: GetConnectionPointComponent,
    data: {
      title: ` Add Connection Point`,
    },
  },
  {
    path: ':id',
    component: GetConnectionPointComponent,
    data: {
      title: `Connection Point`,
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConnectionPointsRoutingModule { }
