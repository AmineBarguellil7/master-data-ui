import { ConnectivityCredentialsOauth } from './connectivity-credentials-oauth';
export class OutboundConnectivityCredentials{
    userName:string ='';
    authType:string='';
    passwordCredentials:string='';
    apiKey:string='';
    oauthCredentials:ConnectivityCredentialsOauth=new ConnectivityCredentialsOauth();
}