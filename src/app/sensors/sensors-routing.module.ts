import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensorsComponent } from './sensors.component';
import { GetSensorComponent } from './get-sensor/get-sensor.component';
import { AuthGuard } from '../guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: SensorsComponent,
    data: {
      title: `Sensors`,
    }
  }
  ,
  { path: 'add', 
  component: GetSensorComponent ,
  data: {
    title: `Add Sensor`,
  }},
  { path: 'add/:cpId', 
  component: GetSensorComponent ,
  data: {
    title: `Add Sensor`,
  }},
  { path: ':id', 
  component: GetSensorComponent ,
  data: {
    title: `Sensor`,
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SensorsRoutingModule { }
