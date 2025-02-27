import { ConnectionPointSearchResult } from 'src/app/connection-points/model/connection-point-search-result';
import {contractLicense} from './contractLicense';
import { formatDate } from '@angular/common';


export class Contract{
    id:string='';
    priorityLevel:string='';
    supplierConnectionPointSelection:string='';
    consumerConnectionPointSelection:string='';
    contractStart=formatDate(new Date(), 'yyyy-MM-dd', 'en');
    contractEnd:Date|null=null;
    serviceId : string='';
    serviceName : string='';

    consumerId:string='';
    supplierId:string='';
    consumerName:string='';
    supplierName:string='';
    revision:number=0;
    supplierLicense:contractLicense=new contractLicense();
    consumerLicense:contractLicense = new contractLicense();
    supplierConnectionPointsIds:string[]=[];
    consumerConnectionPointsIds:string[]=[];
    supplierConnectionPoints:ConnectionPointSearchResult[]=[];
    consumerConnectionPoints:ConnectionPointSearchResult[]=[];
}