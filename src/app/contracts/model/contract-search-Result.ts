export class ContractSearchResult {
    id  :string ='';
    supplierId :string='';
    supplierName :string='';
    consumerId :string='';
    consumerName :string='';
    serviceName :string='';
    contractStart  : Date=new Date();
    contractEnd  : Date|null =null;
}