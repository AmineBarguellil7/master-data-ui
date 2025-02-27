import { ConnectionPointConnectivity } from 'src/app/connection-points/model/connection-point-connectivity';
import { CPService } from './connection-point-service';
import {formatDate} from '@angular/common';

export class ConnectionPoint{
    id:string ='';
    revision:number=0;
    type:string='';
    name:string='';
    locationId:string='';
    facilityId:string='';
    cellId:string='';
    operatorId:string='';
    carparkType?:string='';
    lastModified:string='';
    orderNumber:string='';
    technicalPlace:string='';
    activatedAt=formatDate(new Date(), 'yyyy-MM-dd', 'en');
    other:string='';
    withLeaveLoop:boolean=false;
    tenantName:string='';
    geometryPath:string='';
    keycloakInboundUser:string='';
    businessPartnerId:string='';
    connectionPointConnectivity?:ConnectionPointConnectivity  =new ConnectionPointConnectivity();
    connectionPointServices:CPService[] =[]
  
   

}