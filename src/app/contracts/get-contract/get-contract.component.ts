import { Component, OnInit } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { forkJoin } from "rxjs";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { BusinessPartnerService } from "src/app/business-partners/service/business-partner.service";
import { ConnectionPointSearchResult } from "src/app/connection-points/model/connection-point-search-result";
import { Service } from "src/app/connection-points/model/service";
import { ConnectionPointService } from "src/app/connection-points/service/connection-point.service";
import { Contract } from "src/app/contracts/model/contract";
import { ContractService } from "../service/contract.service";

@Component({
  selector: "app-get-contract",
  templateUrl: "./get-contract.component.html",
  styleUrls: ["./get-contract.component.scss"],
})
export class GetContractComponent implements OnInit {
  id: string | null = "";
  contract = new Contract();
  services: Service[] = [];
  selectedService: Service = new Service;
  selectedSupplierLicense: string | null = null;
  selectedConsumerLicense: string | null = null;
  consumerConnectionPointsSource: ConnectionPointSearchResult[] = [];
  supplierConnectionPointsTarget: ConnectionPointSearchResult[] = [];
  consumerConnectionPointsTarget: ConnectionPointSearchResult[] = [];
  supplierConnectionPointsSource: ConnectionPointSearchResult[] = [];
  supplierSuggestions: string[] = [];
  consumerSuggestions: string[] = [];
  suppliers: BusinessPartnerNameId[] = [];
  consumers: BusinessPartnerNameId[] = [];
  userIsAdmin: boolean = false;
  updateMode: boolean = false;
  dateValid: boolean =true;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private businessPartnerService: BusinessPartnerService,
    private connectionPointService: ConnectionPointService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService
  ) { }

  ngOnInit(): void {
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.businessPartnerService
      .getBusinessPartnersNamesIdsByType("ECONN_SERVER")
      .subscribe({
        next: (res: BusinessPartnerNameId[]) => {
          this.suppliers = res;
        },
        error: (error) => {
          console.log("error getting suppliers");
        },
      });
    this.businessPartnerService
      .getBusinessPartnersNamesIdsByType("FACILITY")
      .subscribe({
        next: (res: BusinessPartnerNameId[]) => {
          this.consumers = res;
        },
        error: (error) => {
          console.log("error getting consumers");
        },
      });
    this.contractService.getServices().subscribe((services) => {
      this.services = services;
    });

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id && this.id != 'add') {
      this.spinner.show();
      this.updateMode = true;
      this.contractService.getContract(this.id).subscribe({
        next: (res: Contract) => {
          this.contract.id = res.id;
          this.contract = res;

          const observables = [];

          const consumerSubscription =
            this.businessPartnerService.getBusinessPartner(res.consumerId);
          const supplierSubscription =
            this.businessPartnerService.getBusinessPartner(res.supplierId);

          observables.push(consumerSubscription);
          observables.push(supplierSubscription);

          if (
            this.contract?.supplierConnectionPointSelection ===
            "SELECTED_ONLY" &&
            this.contract?.supplierId
          ) {
            const supplierConnectionPointSubscription =
              this.connectionPointService.getConnectionPointsByBPId(
                this.contract?.supplierId, "ECONN_SERVER"
              );
            observables.push(supplierConnectionPointSubscription);
          }

          if (
            this.contract?.consumerConnectionPointSelection ===
            "SELECTED_ONLY" &&
            this.contract?.consumerId
          ) {
            const consumerConnectionPointSubscription =
              this.connectionPointService.getConnectionPointsByBPId(
                this.contract?.consumerId, 'FACILITY'
              );
            observables.push(consumerConnectionPointSubscription);
          }

          forkJoin(observables).subscribe({
            next: (results: any[]) => {
              const [
                consumerBusinessPartner,
                supplierBusinessPartner,
                supplierConnectionPoints,
                consumerConnectionPoints,
              ] = results;

              if (consumerBusinessPartner) {
                this.contract.consumerLicense.currency =
                  consumerBusinessPartner.currency;
                this.contract.consumerName = consumerBusinessPartner.name;
              }

              if (supplierBusinessPartner) {
                this.contract.supplierLicense.currency =
                  supplierBusinessPartner.currency;
                this.contract.supplierName = supplierBusinessPartner.name;
              }

              if (supplierConnectionPoints) {
                this.supplierConnectionPointsSource =
                  supplierConnectionPoints.filter(
                    (item: ConnectionPointSearchResult) =>
                      !this.contract.supplierConnectionPoints.some(
                        (cpItem: ConnectionPointSearchResult) =>
                          cpItem.id == item.id
                      )
                  );
                this.supplierConnectionPointsTarget =
                  supplierConnectionPoints.filter(
                    (item: ConnectionPointSearchResult) =>
                      this.contract.supplierConnectionPoints.some(
                        (contractItem: ConnectionPointSearchResult) =>
                          contractItem.id == item.id
                      )
                  );
              }

              if (consumerConnectionPoints) {
                this.consumerConnectionPointsSource =
                  consumerConnectionPoints.filter(
                    (item: ConnectionPointSearchResult) =>
                      !this.contract.consumerConnectionPoints.some(
                        (contractItem: ConnectionPointSearchResult) =>
                          contractItem.id === item.id
                      )
                  );
                this.consumerConnectionPointsTarget =
                  consumerConnectionPoints.filter(
                    (item: ConnectionPointSearchResult) =>
                      this.contract.consumerConnectionPoints.some(
                        (contractItem: ConnectionPointSearchResult) =>
                          contractItem.id === item.id
                      )
                  );
              }
              this.selectedSupplierLicense =
                this.contract?.supplierLicense.licenseType;
              this.selectedConsumerLicense =
                this.contract?.consumerLicense.licenseType;
              this.spinner.hide();
            },
            error: (error) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Error processing data",
              });
              this.spinner.hide();
            },
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error getting contract",
          });
          this.spinner.hide();
        },
      });
    }
  }

  Update(updateForm: NgForm) {
    this.spinner.show();
    if (this.contract.supplierConnectionPointSelection === "ALL") {
      this.connectionPointService
        .getConnectionPointsByBPId(this.contract?.supplierId, 'ECONN_SERVER')
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.contract.supplierConnectionPointsIds = res.map(
              (cp: ConnectionPointSearchResult) => cp.id
            );
          },
          error: (error) => {
            console.log("error getting connection points");
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting conection points",
            });
          },
        });
    }

    if (this.contract.consumerConnectionPointSelection === "ALL") {
      this.connectionPointService
        .getConnectionPointsByBPId(this.contract?.consumerId, 'FACILITY')
        .subscribe({
          next: (res: any) => {
            this.contract.consumerConnectionPointsIds = res.map(
              (cp: ConnectionPointSearchResult) => cp.id
            );
          },
          error: (error) => {
            console.log("error getting connection points");
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting conection points",
            });
          },
        });
    } else {
      this.contract.supplierConnectionPointsIds =
        this.supplierConnectionPointsTarget.map(
          (cp: ConnectionPointSearchResult) => cp.id
        );
      this.contract.consumerConnectionPointsIds =
        this.consumerConnectionPointsTarget.map(
          (cp: ConnectionPointSearchResult) => cp.id
        );
    }
    if (updateForm.valid) {
      this.validateDate();
      if(this.dateValid){
      this.contractService.Update(this.contract).subscribe(
        {
          next: (res) => {

            if (this.updateMode) {
              this.spinner.hide();
              var tempSupp = this.contract.supplierName;
              var tempCons = this.contract.consumerName;
              this.contract = res;
              this.contract.supplierName = tempSupp;
              this.contract.consumerName = tempCons;
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "contract updated successfully",
              });
            }
            else {
              setTimeout(() => {
                this.spinner.hide();
                this.router.navigate(['/contracts/' + res.id]);
              }, 1500);
            }
          },
          error: (err) => {
            this.spinner.hide();
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error updating contract",
            });
          }
        }
      );}
      else {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Contract end must be After Contract Start",
        });
      }

    } else {
      this.spinner.hide();
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Validation error occurred",
      });
    }
  }

  filterConsumers(event: AutoCompleteCompleteEvent) {
    if(this.consumers){
      let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.consumers as any[]).length; i++) {
      let consumer = (this.consumers as any[])[i];
      if (consumer.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(consumer);
      }
    }
    this.consumerSuggestions = filtered;
    }
    else{
      this.consumerSuggestions=[];
    }
    
  }
  onConsumerSelect(selectedConsumer: any): void {
    if (selectedConsumer != null) {
      this.contract.consumerName = selectedConsumer.value.name;
      this.contract.consumerId = selectedConsumer.value.id;
      this.businessPartnerService.getBusinessPartner(this.contract.consumerId).subscribe(
        {
          next: (res) => {
            this.contract.consumerLicense.currency = res.currency;
          },
          error: (err) => {
            console.log("error getting consumer");
          }
        }
      )
    }
    if (this.contract.consumerConnectionPointSelection == "SELECTED_ONLY") {
      this.spinner.show();

      this.connectionPointService
        .getConnectionPointsByBPId(this.contract.consumerId, 'FACILITY')
        .subscribe({
          next: (res: any) => {
            this.consumerConnectionPointsSource = res;
            this.consumerConnectionPointsTarget = [];
            this.spinner.hide();
          },
          error: (error) => {
            console.log("error getting connection points");
            this.spinner.hide();
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting connection points",
            });
          },
        });
    }
  }
  filterSuppliers(event: AutoCompleteCompleteEvent) {
    if(this.suppliers){
      let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.suppliers as any[]).length; i++) {
      let supplier = (this.suppliers as any[])[i];
      if (supplier.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(supplier);
      }
    }
    this.supplierSuggestions = filtered;
    }
    else{
      this.supplierSuggestions = [];
    }
    
  }
  onSupplierSelect(selectedSupplier: any): void {
    if (selectedSupplier != null) {
      this.contract.supplierName = selectedSupplier.value.name;
      this.contract.supplierId = selectedSupplier.value.id;
      this.businessPartnerService.getBusinessPartner(this.contract.supplierId).subscribe(
        {
          next: (res) => {
            this.contract.supplierLicense.currency = res.currency;
          },
          error: (err) => {
            console.log("error getting Supplier");
          }
        }
      )
    }
    if (this.contract.supplierConnectionPointSelection == "SELECTED_ONLY") {
      this.spinner.show();
      this.connectionPointService
        .getConnectionPointsByBPId(this.contract.supplierId, "ECONN_SERVER")
        .subscribe({
          next: (res: any) => {
            this.supplierConnectionPointsSource = res;
            this.supplierConnectionPointsTarget = [];
            this.spinner.hide();
          },
          error: (error) => {
            this.spinner.hide();
            console.log("error getting connection points");
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error getting connection points",
            });
          },
        });
    }
  }

  deleteContract(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this Contract ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.spinner.show();
        this.contractService.delete([this.contract.id]).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "contract deleted successfully",
            });
            this.spinner.hide();
            this.router.navigate(["/contracts"]);
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
        },
        });
      },
    });
  }
  onSelectService() {
    var id = this.services.find(service => service.name === this.contract.serviceName)?.id;
    if (id) {
      this.contract.serviceId = id;
    }
  }
  validateDate(): void {
    if(this.contract.contractEnd){
    const startDate = new Date(this.contract.contractStart);
    const endDate = new Date(this.contract.contractEnd);
    console.log(startDate);
    console.log(endDate);
    this.dateValid = startDate<=endDate; 
  console.log(this.dateValid)}
  }
}
