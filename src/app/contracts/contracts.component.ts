import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService } from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { TableLazyLoadEvent } from "primeng/table";
import { BusinessPartnerNameId } from "../business-partners/model/business-partner-name-id";
import { BusinessPartnerService } from "../business-partners/service/business-partner.service";
import { AuthGuard } from "../guards/auth.guard";
import { Column } from "./../utils/column";
import { Page } from "./../utils/page";
import { ContractSearchResult } from "./model/contract-search-Result";
import { ContractService } from "./service/contract.service";
import { Contract } from "./model/contract";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-contracts",
  templateUrl: "./contracts.component.html",
  styleUrls: ["./contracts.component.scss"],
})
export class ContractsComponent implements OnInit {
  contractPage: Page<ContractSearchResult> = new Page<ContractSearchResult>();


  contractsPage : Page<Contract> = new Page<Contract>();  

  cols!: Column[];
  selectedColumns!: Column[];
  pageSize = 10;
  currentPage = 0;
  sortField = "contractStart";
  sortOrder = "DESC";
  tenantSuggestions: string[] = [];
  selectedTenant!: string;
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  selectedBusinessPartner: any;
  selectedBusinessPartnerId!: string;
  selectedContracts!: ContractSearchResult[];
  searchParams: any = {
    tenant: this.selectedTenant,
  };
  loading: boolean = true;
  userIsAdmin: boolean = false;
  businessPartnerNameIds: BusinessPartnerNameId[] = [];
  tenants: string[] = [];
  
  constructor(
    private contractService: ContractService,
    private businesspartnerService: BusinessPartnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authGuard: AuthGuard,
    private kc: KeycloakService
  ) {}



  items: MenuItem[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.businesspartnerService.getBusinessPartnersNamesIds().subscribe({
      next: (res: BusinessPartnerNameId[]) => {
        this.businessPartnerNameIds = res;
      },
      error: () => {
        console.log("error fetching business partnerNames");
      },
    });
    this.businesspartnerService.getTenants().subscribe({
      next: (res: string[]) => {
        this.tenants = res;
        this.loading = false;
      },
      error: () => {
        console.log("error fetching business partnerNames");
        this.loading = false;
      },
    });

    this.cols = [
      { field: "supplierId", header: "Supplier ID" },
      { field: "supplierName", header: "Supplier Name" },
      { field: "consumerId", header: "Consumer ID" },
      { field: "consumerName", header: "Consumer Name" },
      { field: "serviceName", header: "Service Name" },
      { field: "contractStart", header: "Contract Start" },
      { field: "contractEnd", header: "Contract End" },
    ];

    this.selectedColumns = this.cols;
    this.updateMenuItems();
  }


  updateMenuItems(): void {
    this.items = [
      {
        label: 'Export',
        icon: 'pi pi-upload',
        command: () => this.clearFilters()
      },
      {
        label: 'Clear',
        icon: 'pi pi-filter-slash',
        command: () => this.clearFilters()
      },
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
        command: () => this.search()
      },
      {
        label: 'Add',
        icon: 'pi pi-plus',
        routerLink: 'add',
        visible: this.userIsAdmin
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: (event: MenuItemCommandEvent) => this.delete(event),
        visible: this.deleteMenuItemVisible 
      }
    ];
  }
  




  search(): void {
    this.loading = true;


    this.contractService
      .search(
        {},
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<ContractSearchResult>) => {
          this.contractPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting contracts",
          });
        },
      });


      
    this.contractService
    .searchContracts(
      {},
      this.pageSize,
      this.currentPage,
      this.sortField + "," + this.sortOrder
    )
    .subscribe({
      next: (res: Page<Contract>) => {
        this.contractsPage = res;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error getting contracts",
        });
      },
    });


  }

  onPageChange(event: TableLazyLoadEvent) {
    this.currentPage = event.first ?? 0;
    this.pageSize = event.rows ?? 10;
    if (Array.isArray(event.sortField)) {
      this.sortField = event.sortField[0] ?? "contractStart";
    } else {
      this.sortField = event.sortField ?? "contractStart";
    }
    if (event.sortOrder == 1) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
    this.search();
  }

  filterTenants(event: AutoCompleteCompleteEvent) {
    if (event && event.query && this.selectedTenant.length > 2) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.tenants as any[]).length; i++) {
        let tenant = (this.tenants as any[])[i];
        if (tenant.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(tenant);
        }
      }
      this.tenantSuggestions = filtered;
    }
  }

  filterBusinessPartners(event: AutoCompleteCompleteEvent) {
    if (event && event.query && this.selectedBusinessPartner.length > 2) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.businessPartnerNameIds as any[]).length; i++) {
        let bp = (this.businessPartnerNameIds as any[])[i];
        if (bp.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(bp);
        }
      }
      this.businessPartnerSuggestions = filtered;
    }
  }

  clearFilters(): void {
    this.selectedTenant = "";
    this.selectedBusinessPartner = "";
    this.search();
  }
  // Define a function to retrieve the ID from a name
  getIdFromName(
    name: string,
    businessPartners: BusinessPartnerNameId[]
  ): string | undefined {
    // Iterate through the array of BusinessPartnerNameId objects
    for (const partner of businessPartners) {
      // Check if the name matches the current object's name
      if (partner.name === name) {
        // If found, return the corresponding ID
        return partner.id;
      }
    }
    // If the name is not found, return undefined
    return undefined;
  }

  searchWithFilters(): void {
    var id: String | undefined;
    this.loading = true;
    console.log(this.selectedBusinessPartner);
    // If the business partner name selected has no corresponding id then return an empty page
    // this is because when you type a name that does not exist in the suggestions instance selectedBusinessPartner will be a string with the value of that name without id
    if (
      this.selectedBusinessPartner &&
      this.selectedBusinessPartner.id == undefined
    ) {
      id = this.getIdFromName(
        this.selectedBusinessPartner,
        this.businessPartnerSuggestions
      );
      if (id == undefined) {
        this.contractPage = new Page<ContractSearchResult>();
        this.contractsPage = new Page<Contract>();
        this.loading = false;
      } else {
        this.searchParams = {
          tenant: this.selectedTenant,
          supplierId: id,
          consumerId: id,
        };


        this.contractService
          .search(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<ContractSearchResult>) => {
              this.contractPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error getting contracts",
              });
            },
          });



          this.contractService
          .searchContracts(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<Contract>) => {
              this.contractsPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error getting contracts",
              });
            },
          });


      }
    } else {
      if (
        this.selectedBusinessPartner &&
        this.selectedBusinessPartner.id &&
        this.selectedBusinessPartner.id != ""
      ) {
        console.log;
        this.searchParams = {
          tenant: this.selectedTenant,
          supplierId: this.selectedBusinessPartner.id,
          consumerId: this.selectedBusinessPartner.id,
        };
      } else {
        this.searchParams = {
          tenant: this.selectedTenant,
        };
      }


      this.contractService
        .search(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<ContractSearchResult>) => {
            this.contractPage = res;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting contracts",
            });
          },
        });



        this.contractService
        .searchContracts(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<Contract>) => {
            this.contractsPage = res;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting contracts",
            });
          },
        });



    }
  }
  delete(event: MouseEvent | MenuItemCommandEvent) {

    let target: EventTarget | null = null;
  
    if (event instanceof MouseEvent) {
      target = event.target;
    } else if ('originalEvent' in event && event.originalEvent) {
      target = event.originalEvent.target;
    }

    this.confirmationService.confirm({
      target: target as EventTarget,
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.loading = true;
        const selectedIds = this.selectedContracts.map(
          (contract) => contract.id
        );
        this.contractService.delete(selectedIds).subscribe({
          next: () => {
            this.selectedContracts = [];
            this.messageService.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Records deleted",
            });
            this.search();
          },
          error: (error) => {
            let detailMessage = "Error deleting records"; 
          if (error.error.message) {
              detailMessage = error.error.message;
            }
          this.messageService.add({
            severity: "error",
            summary: "Rejected",
            detail: detailMessage,
          });
          this.loading = false;
        },
        });
      },
    });
  }



  get deleteMenuItemVisible(): boolean {
    // Check if the user is an admin and there are selected sensors
    if (this.userIsAdmin && this.selectedContracts) {
      // If no sensors are selected or more than one sensor is selected, hide the delete button
      if (this.selectedContracts.length === 0) {
        return false;
      }
      // If only one sensor is selected, show the delete button
      return true;
    }
    // If the user is not an admin or there are no selected sensors, hide the delete button
    return false;
  }


  onRowSelect(event: any): void {
    this.updateMenuItems();
  }
  

  onRowUnselect(event: any): void {
    this.updateMenuItems();
  }


  

  exportToExcel(): void {
    this.loading = true;
    this.handleExport();
  }
  
  handleExport(): void {
    const contracts = new Set<Contract>(
      this.contractsPage.content.map(c => ({
        id: c.id,
        revision: c.revision,
        priorityLevel: c.priorityLevel,
        supplierConnectionPointSelection: c.supplierConnectionPointSelection,
        consumerConnectionPointSelection: c.consumerConnectionPointSelection,
        contractStart: c.contractStart ? formatDate(c.contractStart, 'yyyy-MM-dd', 'en') : formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        contractEnd: c.contractEnd,
        serviceId: c.serviceId,
        serviceName: c.serviceName,
        consumerId: c.consumerId,
        supplierId: c.supplierId,
        consumerName: c.consumerName,
        supplierName: c.supplierName,
        supplierLicense: c.supplierLicense,
        consumerLicense: c.consumerLicense,
        supplierConnectionPointsIds: c.supplierConnectionPointsIds,
        consumerConnectionPointsIds: c.consumerConnectionPointsIds,
        supplierConnectionPoints: c.supplierConnectionPoints,
        consumerConnectionPoints: c.consumerConnectionPoints
      }))
    );
    
    this.exportContractsToExcel(contracts);
  }
  


  
  exportContractsToExcel(contracts: Set<Contract>): void {
    this.contractService.exportToExcel(contracts).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contracts.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Excel exported successfully.',
        });
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error exporting Excel: ' + error.message,
        });
      }
    );
  }


}
