import { BpContractsComponent } from './get-business-partner/bp-contracts/bp-contracts.component';
import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessPartnersRoutingModule } from './business-partners-routing.module';
import { BusinessPartnersComponent } from './business-partners.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
// utils
import { DocsComponentsModule } from '../../components/docs-components.module';
import { SkeletonModule } from 'primeng/skeleton';
import { PanelModule } from 'primeng/panel';
import {GetBusinessPartnerComponent} from './get-business-partner/get-business-partner.component'
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import {HttpClientModule} from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSpinnerModule } from "ngx-spinner";
import { TagModule } from 'primeng/tag';



import { SplitButtonModule } from 'primeng/splitbutton';


// CoreUI Modules
import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  CardModule,
  CarouselModule,
  CollapseModule,
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
import { BpConnectionPointsComponent } from './get-business-partner/bp-connection-points/bp-connection-points.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from 'keycloak-angular';
import{BpDetailsComponent} from './get-business-partner/bp-details/bp-details.component'

@NgModule({
  providers:[KeycloakService],
  declarations: [
    BusinessPartnersComponent,
    GetBusinessPartnerComponent,
    BpConnectionPointsComponent,
    BpContractsComponent,
    BpDetailsComponent],
  imports: [
    CommonModule,
    BusinessPartnersRoutingModule,
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
    InputTextModule,
    AutoCompleteModule ,
    SkeletonModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule,
    MatSelectCountryModule, 
    HttpClientModule,
    MatIconModule,
    NgxSpinnerModule,
    SplitButtonModule,
    TagModule
  ]
})
export class BusinessPartnersModule { }
