import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts.component';
import { GetContractComponent } from './get-contract/get-contract.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ContractsComponent,
    data: {
      title: `Contracts`,
    }
  } ,
  { path: 'add', 
  component: GetContractComponent ,
  data: {
    title: `Add Contract`,
  }},
  { path: ':id', 
  component: GetContractComponent ,
  data: {
    title: `Contract`,
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
