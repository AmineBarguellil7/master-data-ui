import { BusinessPartnerNameId } from "./model/business-partner-name-id";
import { BusinessPartnerService } from "./service/business-partner.service";
import { Page } from "./../utils/page";
import { Column } from "./../utils/column";
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { BusinessPartnerSearchResult } from "./model/business-partner-search-result";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { KeycloakService } from "keycloak-angular";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";



import { MenuItemCommandEvent } from 'primeng/api';
import { BusinessPartner } from "./model/business-partner";






@Component({
  selector: "app-business-partners",
  templateUrl: "./business-partners.component.html",
  styleUrl: "./business-partners.component.scss",
})
export class BusinessPartnersComponent implements OnInit {


  // @ViewChild('multiSelectWrapper', { static: false }) multiSelectWrapper!: ElementRef;


  businessPartnerNameIds: BusinessPartnerNameId[] = [];
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  tenantSuggestions: string[] = [];
  loading = true;
  businessPartnerPage: Page<BusinessPartnerSearchResult> =
    new Page<BusinessPartnerSearchResult>();


  businessPartnersPage : Page<BusinessPartner> = new Page<BusinessPartner>();



  cols!: Column[];
  selectedBusinessPartner: any;
  selectedTenant = "";
  selectedColumns!: Column[];
  pageSize = 10;
  currentPage = 0;
  sortField = "name";
  sortOrder = "DESC";
  tenants = [""];
  searchParams: any = {
    "tenant": this.selectedTenant,
  };
  userIsAdmin: boolean = false;
  selectedBps!: BusinessPartnerSearchResult[];



  items: MenuItem[] = [];

  constructor(
    private businesspartnerService: BusinessPartnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private kc: KeycloakService,
    // private renderer: Renderer2
  ) {}




  // onDropdownShow(event: any) {
  //   const dropdownPanel = this.multiSelectWrapper.nativeElement.querySelector('.p-multiselect-panel');
  //   if (window.innerWidth <= 991) {
  //     this.renderer.setStyle(dropdownPanel, 'top', 'auto');
  //     this.renderer.setStyle(dropdownPanel, 'bottom', '100%');
  //     this.renderer.setStyle(dropdownPanel, 'transform', 'translateY(-100%)');
  //   }
  // }




  ngOnInit(): void {
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
      },
      error: () => {
        console.log("error fetching business partnerNames");
      },
    });
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.loading = true;
    this.cols = [
      { field: "partnerNumber", header: "Partner Number" },
      { field: "name", header: "Partner Name" },
      { field: "countryCode", header: "Country" },
      { field: "city", header: "City" },
    ];
    this.selectedColumns = this.cols;
    this.updateMenuItems();
  }



  updateMenuItems(): void {
    this.items = [
      {
        label: 'Export',
        icon: 'pi pi-upload',
        command: () => this.exportToExcel()
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


    this.businesspartnerService
      .search(
        {},
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<BusinessPartnerSearchResult>) => {
          this.businessPartnerPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Getting Business Partners",
          });
        },
      });




      this.businesspartnerService
        .searchBusinessPartners(
          {},
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<BusinessPartner>) => {
            this.businessPartnersPage = res;
            this.loading = false;
            // this.handleExport();
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error Getting Business Partners",
            });
          },
        });
        


  }

  onPageChange(event: TableLazyLoadEvent) {
    this.currentPage = event.first ?? 0;
    this.pageSize = event.rows ?? 10;
    if (Array.isArray(event.sortField)) {
      this.sortField = event.sortField[0] ?? "name"; // Select the first item or provide a default value
    } else {
      this.sortField = event.sortField ?? "name"; // Use the value directly or provide a default value
    }
    if (event.sortOrder == 1) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
    this.search();
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
        this.businessPartnerNameIds
      );
      if (id == undefined) {
        this.businessPartnerPage = new Page<BusinessPartnerSearchResult>();

        this.businessPartnersPage = new Page<BusinessPartner>();


        this.loading = false;
      } else {
        this.searchParams = {
          "tenant": this.selectedTenant,
          id: id,
        };


        this.businesspartnerService
          .searchBusinessPartners(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<BusinessPartner>) => {
              this.businessPartnersPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error Getting Business Partners",
              });
            },
          });


        


        this.businesspartnerService
          .search(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<BusinessPartnerSearchResult>) => {
              this.businessPartnerPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error Getting Business Partners",
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
        this.searchParams = {
          "tenant": this.selectedTenant,
          id: this.selectedBusinessPartner.id,
        };
      } else {
        this.searchParams = {
          "tenant": this.selectedTenant,
        };
      }



      this.businesspartnerService
        .searchBusinessPartners(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<BusinessPartner>) => {
            this.loading = false;
            this.businessPartnersPage = res;
          },
          error: (error) => {
            this.loading = false;
          },
        });





      this.businesspartnerService
        .search(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<BusinessPartnerSearchResult>) => {
            this.loading = false;
            this.businessPartnerPage = res;
          },
          error: (error) => {
            this.loading = false;
          },
        });
    }
  }
  clearFilters(): void {
    this.selectedBusinessPartner = { id: "", name: "" };
    this.selectedTenant = "";
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

        const selectedIds = this.selectedBps.map((bp) => bp.id);
        this.businesspartnerService.delete(selectedIds).subscribe({
          next: () => {
            this.selectedBps = [];
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
    if (this.userIsAdmin && this.selectedBps) {
      // If no sensors are selected or more than one sensor is selected, hide the delete button
      if (this.selectedBps.length === 0) {
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
    console.log(this.businessPartnersPage);
    this.handleExport();
  }
  
  handleExport(): void {
    const businessPartners = new Set<BusinessPartner>(
      this.businessPartnersPage.content.map(bp => ({
        id: bp.id,
        partnerNumber: bp.partnerNumber,
        providerId: bp.providerId,
        tenantId: bp.tenantId,
        name: bp.name,
        countryCode: bp.countryCode,
        city: bp.city,
        currency: bp.currency,
        switchOffExit: bp.switchOffExit,
        type: bp.type,
        revision: bp.revision,
        contactPerson: bp.contactPerson,
      }))
    );
    console.log(businessPartners);
    this.exportBusinessPartnersToExcel(businessPartners);
  }
  


  
  exportBusinessPartnersToExcel(businessPartners: Set<BusinessPartner>): void {
    this.businesspartnerService.exportToExcel(businessPartners).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-partners.xlsx';
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
