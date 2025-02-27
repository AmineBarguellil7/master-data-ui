import { InboundConnectivityCredentials } from "./inbound-connectivity-credentials";
import { OutboundConnectivityCredentials } from "./outbound-connectivity-credentials";

export class ConnectionPointConnectivity{
    id:string ='';
    revision:number=0;
    port:number=0;
    host:string='';
    baseUrl:string='';
    requestFormat:string='';
    responseFormat:string='';
    outboundCredentials?:OutboundConnectivityCredentials =new OutboundConnectivityCredentials();
    inboundCredentials?:InboundConnectivityCredentials =new InboundConnectivityCredentials();

}