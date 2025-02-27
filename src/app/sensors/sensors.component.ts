import { SensorService } from "./service/sensor.service";
import { Page } from "./../utils/page";
import { Column } from "./../utils/column";
import { Component } from "@angular/core";
import { ConfirmationService, MenuItem, MessageService, SortEvent } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { SensorSearchResult } from "./model/sensor-search-result";
import { BusinessPartnerService } from "../business-partners/service/business-partner.service";
import { ConnectionPointService } from "../connection-points/service/connection-point.service";
import { BusinessPartnerNameId } from "../business-partners/model/business-partner-name-id";
import { ConnectionPointSearchResult } from "../connection-points/model/connection-point-search-result";
import { AuthGuard } from "../guards/auth.guard";
import { KeycloakService } from "keycloak-angular";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { MenuItemCommandEvent } from 'primeng/api';
import { Sensor } from "./model/sensor";




@Component({
  selector: "app-sensors",
  templateUrl: "./sensors.component.html",
  styleUrl: "./sensors.component.scss",
})
export class SensorsComponent {
  userIsAdmin: boolean = false;
  tenants: string[] = [];
  businessPartnerNameIds: BusinessPartnerNameId[] = [];
  sensorPage: Page<SensorSearchResult> = new Page<SensorSearchResult>();



  sensorsPage: Page<Sensor> = new Page<Sensor>(); 

  connectionPointList!: ConnectionPointSearchResult[];
  cols!: Column[];
  loading: boolean = true;
  selectedColumns!: Column[];
  pageSize = 10; // Number of items per page
  currentPage = 0; // Current page number
  sortField = "serialNumber";
  connectionPointsortField = "name";
  sortOrder = "DESC";
  tenantSuggestions: string[] = [];
  selectedTenant!: string;
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  selectedBusinessPartner: any;
  selectedBusinessPartnerId!: string;
  selectedSensors!: SensorSearchResult[];
  searchParams: any = {
    tenantName: this.selectedTenant,
  };





  items: MenuItem[] = [];
  







  constructor(
    private sensorService: SensorService,
    private businesspartnerService: BusinessPartnerService,
    private connectionPointService: ConnectionPointService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authGuard: AuthGuard,
    private kc: KeycloakService
  ) {}

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    
    this.businesspartnerService.getBusinessPartnersNamesIds().subscribe({
      next: (res: BusinessPartnerNameId[]) => {
        this.businessPartnerNameIds = res;
      },
      error: () => {
        console.log("error fetching business partner names");
      },
    });

    this.businesspartnerService.getTenants().subscribe({
      next: (res: string[]) => {
        this.tenants = res;
      },
      error: () => {
        console.log("error fetching tenants");
      },
    });

    this.cols = [
      { field: "serialNumber", header: "Serial Number" },
      { field: "locationId", header: "Location Id" },
      { field: "laneNumber", header: "Lane Number" },
      { field: "direction", header: "Direction" },
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


    this.sensorService
      .search(
        {},
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<SensorSearchResult>) => {
          this.sensorPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting sensors",
          });
        },
      });


      this.sensorService
      .searchSensors(
        {},
        this.pageSize,
        this.currentPage,
        this.sortField + "," + this.sortOrder
      )
      .subscribe({
        next: (res: Page<Sensor>) => {
          this.sensorsPage = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting sensors",
          });
        },
      });




  }

  customSort(event: SortEvent) {}
  onPageChange(event: TableLazyLoadEvent) {
    this.currentPage = event.first ?? 0;
    this.pageSize = event.rows ?? 10;
    if (Array.isArray(event.sortField)) {
      this.sortField = event.sortField[0] ?? "serialNumber"; // Select the first item or provide a default value
    } else {
      this.sortField = event.sortField ?? "serialNumber"; // Use the value directly or provide a default value
    }
    if (event.sortOrder == 1) {
      this.sortOrder = "ASC";
    } else {
      this.sortOrder = "DESC";
    }
    this.search();
  }

  clearFilters(): void {
    this.selectedTenant = "";
    this.selectedBusinessPartner = "";
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

  searchWithFilters(): void {
    var id: String | undefined;
    this.loading = true;
    console.log(this.selectedBusinessPartner);
    // If the business partner name selected has no corresponding id then return an empty page
    // this is because when you type a name that does not exist in the suggestions instance businessPartner will be a string with the value of that name without id
    if (
      this.selectedBusinessPartner &&
      this.selectedBusinessPartner.id == undefined
    ) {
      id = this.getIdFromName(
        this.selectedBusinessPartner,
        this.businessPartnerSuggestions
      );
      if (id == undefined) {
        this.sensorPage = new Page<SensorSearchResult>();
        this.sensorsPage = new Page<Sensor>();
        this.loading = false;
      } else {
        this.searchParams = {
          tenantName: this.selectedTenant,
          businessPartnerId: id,
        };


        this.sensorService
          .search(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<SensorSearchResult>) => {
              this.sensorPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error getting sensors",
              });
            },
          });





          this.sensorService
          .searchSensors(
            this.searchParams,
            this.pageSize,
            this.currentPage,
            this.sortField + "," + this.sortOrder
          )
          .subscribe({
            next: (res: Page<Sensor>) => {
              this.sensorsPage = res;
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error getting sensors",
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
        console.log("BP SELECTED");
        this.searchParams = {
          tenantName: this.selectedTenant,
          businessPartnerId: this.selectedBusinessPartner.id,
        };
      } else {
        this.searchParams = {
          tenantName: this.selectedTenant,
        };
      }


      this.sensorService
        .search(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<SensorSearchResult>) => {
            this.sensorPage = res;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting sensors",
            });
          },
        });





        this.sensorService
        .searchSensors(
          this.searchParams,
          this.pageSize,
          this.currentPage,
          this.sortField + "," + this.sortOrder
        )
        .subscribe({
          next: (res: Page<Sensor>) => {
            this.sensorsPage = res;
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting sensors",
            });
          },
        });



    }
  }


  delete(event: MouseEvent | MenuItemCommandEvent) {

    console.log('Delete event:', event);
    console.log('Delete method context:', this);

    let target: EventTarget | null = null;
  
    if (event instanceof MouseEvent) {
      target = event.target;
    } else if ('originalEvent' in event && event.originalEvent) {
      target = event.originalEvent.target;
    }


    console.log('Target for confirmation:', target);
  
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
        const selectedSensorIds = this.selectedSensors.map(
          (sensor) => sensor.id
        );
        this.sensorService.delete(selectedSensorIds).subscribe({
          next: () => {
            this.selectedSensors = [];
            this.messageService.add({
              severity: "info",
              summary: "Confirmed",
              detail: "Records deleted",
            });
            this.search();
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "Error deleting records",
            });
          },
        });
      },
    });
  }




  get deleteMenuItemVisible(): boolean {
    // Check if the user is an admin and there are selected sensors
    if (this.userIsAdmin && this.selectedSensors) {
      // If no sensors are selected or more than one sensor is selected, hide the delete button
      if (this.selectedSensors.length === 0) {
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
    const sensors = new Set<Sensor>(
      this.sensorsPage.content.map(c => ({
        id: c.id,
        revision: c.revision,
        serialNumber: c.serialNumber,
        laneNumber: c.laneNumber,
        direction: c.direction,
        locationId: c.locationId,
        deviceName: c.deviceName,
        tenantName: c.tenantName,
        connectionPointId: c.connectionPointId,
        apiKey: c.apiKey
      }))
    );
    
    this.exportSensorsToExcel(sensors);
  }
  


  
  exportSensorsToExcel(sensors: Set<Sensor>): void {
    this.sensorService.exportToExcel(sensors).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sensors.xlsx';
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
