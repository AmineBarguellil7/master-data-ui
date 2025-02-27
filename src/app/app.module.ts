import { CountryService } from './utils/countryservice.service';
import { NgModule , APP_INITIALIZER } from '@angular/core';
import {  LocationStrategy , PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { NgScrollbarModule } from 'ngx-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';


// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';
import { TableModule } from 'primeng/table';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';


import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { BusinessPartnersModule } from './business-partners/business-partners.module';
import {ConnectionPointsModule} from './connection-points/connection-points.module';
import {ContractsModule} from './contracts/contracts.module';
import {SensorsModule} from './sensors/sensors.module';
import { HttpClientModule } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { environment } from 'src/environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import{initializeKeycloak}from 'src/app/init/keycloak-init.factory'
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { Page404Component } from './page404/page404.component';



const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];








@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS , UnauthorizedComponent , Page404Component],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    BusinessPartnersModule,
    ConnectionPointsModule,
    SensorsModule,
    ContractsModule,
    HttpClientModule,
    TableModule,
    KeycloakAngularModule,
    MatSelectCountryModule.forRoot('en'),
    HttpClientModule,
  
  ],
  providers: [
    ConfirmationService,
    MessageService,
    CountryService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    IconSetService,
    Title,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
