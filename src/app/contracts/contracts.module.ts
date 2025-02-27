import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';

import { ContractsComponent } from './contracts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import {GetContractComponent} from './get-contract/get-contract.component';
import { ListboxModule } from 'primeng/listbox';
import { PanelModule } from 'primeng/panel';
import { MatIconModule } from '@angular/material/icon';
import { PickListModule } from 'primeng/picklist';

import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxSpinnerModule } from "ngx-spinner";

import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { SplitButtonModule } from 'primeng/splitbutton';

// utils
import { DocsComponentsModule } from '../../components/docs-components.module';
// CoreUI Modules
import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule
} from '@coreui/angular';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { KeycloakService } from 'keycloak-angular';

@NgModule({
  providers:[KeycloakService],
  declarations: [ContractsComponent , GetContractComponent],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    UtilitiesModule,
    SharedModule,
    ListGroupModule,
    IconModule,
    ListGroupModule,
    PlaceholderModule,
    ProgressModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    ReactiveFormsModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    DocsComponentsModule,
    HttpClientModule,
    FormsModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    AutoCompleteModule,
    SkeletonModule,
    ListboxModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule,
    MatIconModule,
    PickListModule,
    RadioButtonModule,
    NgxSpinnerModule,
    SplitButtonModule
  ]
})
export class ContractsModule { }
