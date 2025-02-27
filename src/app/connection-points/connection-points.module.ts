import { GetConnectionPointComponent } from './get-connection-point/get-connection-point.component';
import { CpConnectivityComponent } from './get-connection-point/cp-connectivity/cp-connectivity.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectionPointsRoutingModule } from './connection-points-routing.module';
import{ConnectionPointsComponent} from './connection-points.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
// utils
import { DocsComponentsModule } from '../../components/docs-components.module';
import { SkeletonModule } from 'primeng/skeleton';
import{CpSensorsComponent}from'./get-connection-point/cp-sensors/cp-sensors.component';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { NgxSpinnerModule } from "ngx-spinner";
import{CpDetailsComponent} from './get-connection-point/cp-details/cp-details.component'



import { SplitButtonModule } from 'primeng/splitbutton';

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
  UtilitiesModule,
} from '@coreui/angular';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { CpServicesComponent } from './get-connection-point/cp-services/cp-services.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from 'keycloak-angular';
@NgModule({
  providers:[KeycloakService],
  declarations: [CpDetailsComponent,
    ConnectionPointsComponent,
    CpSensorsComponent,
  CpConnectivityComponent,
GetConnectionPointComponent,
CpServicesComponent ,
],
  imports: [
    CommonModule,
    ConnectionPointsRoutingModule,
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
    AutoCompleteModule ,
    SkeletonModule,
    CalendarModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule,
    MatIconModule,
    PasswordModule,
    NgxSpinnerModule,
    SplitButtonModule
    
  ]
})
export class ConnectionPointsModule { }
