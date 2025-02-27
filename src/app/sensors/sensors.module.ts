import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SensorsRoutingModule } from './sensors-routing.module';

import { SensorsComponent } from './sensors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { GetSensorComponent } from './get-sensor/get-sensor.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from "ngx-spinner";

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
import { KeycloakService } from 'keycloak-angular';
import { MatMenuItem } from '@angular/material/menu';


@NgModule({
  providers:[KeycloakService],
  declarations: [SensorsComponent,GetSensorComponent],
  imports: [
    CommonModule,
    SensorsRoutingModule,
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
    FormsModule,
    MultiSelectModule,
    PaginatorModule,
    InputTextModule,
    AutoCompleteModule,
    SkeletonModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule,
    MatIconModule,
    NgxSpinnerModule,
    SplitButtonModule,

  ]
})
export class SensorsModule { }
