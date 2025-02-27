// export const environment = {
//   production: false,
//   apiBaseUrl: "http://ad58d2bc37f7c49cdb957be093ce5c12-1882356018.us-east-1.elb.amazonaws.com:8081/v1", 
//   keycloak: {
//     url: 'http://a5664643fc91a4d36a76603027bdc481-1538120907.us-east-1.elb.amazonaws.com:8080', 
//     realm: 'ec',
//     clientId: 'MasterDataUi',
//   }
// };


export const environment = {
  production: false,
  apiBaseUrl:   "http://localhost:8081/v1",
  keycloak: {
    url: 'http://localhost:8090',
    realm: 'ec',
    clientId: 'MasterDataUi',
  }
};


// export const environment = {
//   production: true,
//   apiBaseUrl: "http://localhost:30101/v1", 
//   keycloak: {
//     url: 'http://localhost:30100', 
//     realm: 'ec',
//     clientId: 'MasterDataUi',
//   }
// };


