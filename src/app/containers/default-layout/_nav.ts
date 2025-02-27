import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Business Partners',
    url: '/businesspartners',
    iconComponent: { name: 'cil-user' },
  
  },
  {
    name: 'Connection Points',
    url: '/connectionpoints',
    iconComponent: { name: 'cil-building' },
  
  },
  {
    name: 'Contracts',
    url: '/contracts',
    iconComponent: { name: 'cil-handshake' },
  
  },
  {
    name: 'Sensors',
    url: '/sensors',
    iconComponent: { name: 'cil-center-focus' },
  
  }
 
];
