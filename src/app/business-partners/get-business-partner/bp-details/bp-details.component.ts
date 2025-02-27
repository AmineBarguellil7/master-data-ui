import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService, ConfirmationService } from "primeng/api";
import { CountryService } from "src/app/utils/countryservice.service";
import { BusinessPartner } from "../../model/business-partner";
import { BusinessPartnerService } from "../../service/business-partner.service";
import { ClipboardService } from "ngx-clipboard";


@Component({
  selector: "app-bp-details",
  templateUrl: "./bp-details.component.html",
  styleUrl: "./bp-details.component.scss",
})
export class BpDetailsComponent implements OnInit {
  updateMode: boolean = false;
  id: string | null = "";
  countries: any[] | undefined;
  businessPartner: BusinessPartner = new BusinessPartner();
  userIsAdmin: boolean = false;
  providerIdUnderHundred: number = 0;
  providerIdAboveHundred: number = 0;
  currenciesMap: any;
  currencies: any;
  constructor(
    private route: ActivatedRoute,
    private businessPartnerService: BusinessPartnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private countryService: CountryService,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.countryService.getAllCountries().then(
     (res)=> {
          this.countries = res
     }
    );
    this.countryService.getAllCurrencies().then(
      (res)=>{
        this.currencies=res;
      }
    )
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    this.businessPartnerService.getProviderIdUnderHundred().subscribe({
      next: (res: number) => {
        this.providerIdUnderHundred = res;
      },
      error: (err) => {
        console.log("Error getting providerID");
      },
    });
    this.businessPartnerService.getProviderIdAboveHundred().subscribe({
      next: (res: number) => {
        this.providerIdAboveHundred = res;
      },
      error: (err) => {
        console.log("Error getting providerID");
      },
    });
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id && this.id != "add") {
      this.updateMode = true;
      this.spinner.show();

      this.businessPartnerService.getBusinessPartner(this.id).subscribe({
        next: (res: BusinessPartner) => {
          this.businessPartner = res;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Getting Business Partner",
          });
        },
      });
    }
  }

  update(addBPForm: NgForm): void {
    if (addBPForm.valid) {
      if(!this.updateMode){
        this .businessPartner.partnerNumber ='' + Date.now();
      }
      this.spinner.show();
      this.businessPartnerService.add(this.businessPartner).subscribe({
        next: (res: BusinessPartner) => {
          if (this.updateMode) {
            this.messageService.add({
              severity: "info",
              summary: "Success",
              detail: "Updated Business Partner Successfully",
            });
          } else {
            this.messageService.add({
              severity: "info",
              summary: "Success",
              detail: "Added Business Partner Successfully",
            });
          }

          if (this.id && this.id != "add") {
            //update
            this.businessPartnerService.getBusinessPartner(this.id).subscribe({
              next: (res: BusinessPartner) => {
                this.businessPartner = res;
                this.spinner.hide();
              },
              error: (error) => {
                this.spinner.hide();
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Error Getting Business Partner",
                });
              },
            });
          } else {
            setTimeout(() => {
              this.spinner.hide();
              this.router.navigate(["/businesspartners/" + res.id]);
            }, 1500);
          }
        },
        error: (error) => {
          this.spinner.hide();

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error Updating Business Partner",
          });
        },
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Form is invalid Please verify fileds",
      });
    }
  }

  delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this Business Partner?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        if (this.id) {
          this.spinner.show();

          const selectedIds = [this.id];
          this.businessPartnerService.delete(selectedIds).subscribe({
            next: () => {
              this.spinner.hide();

              this.messageService.add({
                severity: "info",
                summary: "Confirmed",
                detail: "Business Partner deleted",
              });
              this.router.navigate(["/businesspartners"]);
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
        }
      },
    });
  }

  selectProviderId(isUnderHundred: boolean) {
    if (isUnderHundred) {
      this.businessPartner.providerId = this.providerIdUnderHundred;
    } else {
      this.businessPartner.providerId = this.providerIdAboveHundred;
    }
  }
  copyId(){
    this.clipboardService.copyFromContent(this.businessPartner.id);
  }
}
