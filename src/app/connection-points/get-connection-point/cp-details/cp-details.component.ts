import { routes } from './../../../app-routing.module';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AutoCompleteCompleteEvent } from "primeng/autocomplete";
import { BusinessPartner } from "src/app/business-partners/model/business-partner";
import { BusinessPartnerNameId } from "src/app/business-partners/model/business-partner-name-id";
import { BusinessPartnerService } from "src/app/business-partners/service/business-partner.service";
import { ConnectionPoint } from "../../model/connection-point";
import { ConnectionPointService } from "../../service/connection-point.service";

@Component({
  selector: "app-cp-details",
  templateUrl: "./cp-details.component.html",
  styleUrl: "./cp-details.component.scss",
})
export class CpDetailsComponent implements OnInit {

  id: string | null = "";
  @Input() connectionPoint!: ConnectionPoint;
  @Output() connectionPointChange = new EventEmitter<ConnectionPoint>();
  @Input() updateMode: boolean = false;
  userIsAdmin: boolean = false;
  businessPartnerNameIds: BusinessPartnerNameId[] = [];
  businessPartnerSuggestions: BusinessPartnerNameId[] = [];
  @Input() selectedBusinessPartner!: any;
  @Output() selectedBusinessPartnerChange =
    new EventEmitter<any>();
@Input()addStage!:number;
@Output()addStageChange=    new EventEmitter<number>();
  bpId: string | null ='';
  bpIsSelected: boolean =false;
  isLocationIdUnique: boolean=true;

  constructor(
    private connectionPointService: ConnectionPointService,
    private businesspartnerService: BusinessPartnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private kc: KeycloakService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    console.log(this.connectionPoint);
    this.bpId = this.route.snapshot.paramMap.get("bpId");
    this.userIsAdmin = this.kc.isUserInRole("SubAdmin");
    if (this.updateMode) {
      this.spinner.show();
      this.extractIds();
      if (this.connectionPoint.businessPartnerId) {
        this.businesspartnerService
          .getBusinessPartner(this.connectionPoint.businessPartnerId)
          .subscribe({
            next: (res: BusinessPartner) => {
              this.selectedBusinessPartner.id=res.id;
              this.selectedBusinessPartner.name=res.name;
              this.spinner.hide();
            },
            error: (error) => {
              this.spinner.hide();

              this.messageService.add({
                severity: "error",
                summary: "Rejected",
                detail: "Error getting Business Partner",
              });
            },
          });
      }
    }
    else if(this.bpId&&this.bpId!=''){
      this.bpIsSelected=true;
      this.businesspartnerService.getBusinessPartner(this.bpId).subscribe(
        {
          next:(res:BusinessPartner)=>{
            this.selectedBusinessPartner.id=res.id;
            this.selectedBusinessPartner.name=res.name;
            this.connectionPoint.businessPartnerId=res.id;
            this.connectionPoint.tenantName=res.tenantId;
           console.log(this.selectedBusinessPartner) ;
           console.log(this.businessPartnerNameIds)
          },
          error:()=>{
            console.log("error getting business partner")
          }
        }
      )
    }
     else {
      console.log(this.bpId)
      this.businesspartnerService.getBusinessPartnersNamesIds().subscribe({
        next: (res: BusinessPartnerNameId[]) => {
          this.businessPartnerNameIds = res;
        },
        error: () => {
          console.log("error fetching business partnerNames");
        },
      });
      
    }
  }
  filterBusinessPartners(event: AutoCompleteCompleteEvent) {
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
  update(updateCPForm: NgForm): void {
    if (updateCPForm.valid && this.selectedBusinessPartner.id!='' && this.isLocationIdUnique) {
      this.constractLocationId();
      if (!this.updateMode) {
        this.connectionPoint.businessPartnerId =
          this.selectedBusinessPartner.id;
          this.connectionPointChange.emit(this.connectionPoint);
          this.addStage=1;
          this.addStageChange.emit(this.addStage);
      }
      else{
        this.spinner.show();
        if(this.connectionPoint.carparkType==''){
          delete this.connectionPoint.carparkType;
        }
        this.connectionPointService.update(this.connectionPoint).subscribe({
          next: (res: ConnectionPoint) => {
            this.connectionPointService.getConnectionPoint(res.id).subscribe({
              next: (res: ConnectionPoint) => {
                this.connectionPoint = res;
                this.spinner.hide();
                this.connectionPointChange.emit(this.connectionPoint  );
  
              },
              error: (error) => {
                this.spinner.hide();
                this.messageService.add({
                  severity: "error",
                  summary: "Rejected",
                  detail: "Error getting Connection Point",
                });
              },
            });
  
            this.messageService.add({
              severity: "info",
              summary: "Updated",
              detail: "Connection Point updated",
            });
          },
          error: (error) => {
            this.spinner.hide();
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "Error Updating Connection Point",
            });
          },
        });
      }
      
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Invalid",
        detail: "Invalid Form",
      });
    }
  }

  delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Do you want to delete this Connection Point ?",
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
          this.connectionPointService.delete(selectedIds).subscribe({
            next: () => {
              this.spinner.hide();
              this.messageService.add({
                severity: "info",
                summary: "Confirmed",
                detail: "Connection Point deleted",
              });
              this.router.navigate(["/connectionpoints"]);
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
  onSelectBp() {
    console.log(this.selectedBusinessPartner);
    this.connectionPoint.businessPartnerId = this.selectedBusinessPartner.id;
    this.businesspartnerService.getBusinessPartner(this.selectedBusinessPartner.id).subscribe(
      {
        next: (res:BusinessPartner)=>{
          this.connectionPoint.tenantName=res.tenantId;

        },
        error:()=>{
          console.log("error getting business partner");
          
        }
      }
    )
    this.selectedBusinessPartnerChange.emit(this.selectedBusinessPartner);
  }
  extractIds() {
    if(this.connectionPoint.facilityId=='' && this.connectionPoint.cellId == ''&& this.connectionPoint.operatorId==''){
      const parts = this.connectionPoint.locationId.split(".");
    if(parts[0]){
      this.connectionPoint.facilityId = parts[0].substring(2);

    }
    if(parts[1]){
      this.connectionPoint.cellId = parts[1];

    }
    if(parts[2]){   
       this.connectionPoint.operatorId = parts[2].substring(1);
    }
    }
    
  }
  constractLocationId(){
    if(this.connectionPoint.type=='FACILITY'){    this.connectionPoint.locationId='SB'+this.connectionPoint.facilityId+'.'+this.connectionPoint.cellId+'.0'+this.connectionPoint.operatorId;
  }

  }

  onConnectionPointChange(newConnectionPoint: ConnectionPoint) {
    this.connectionPointChange.emit(newConnectionPoint);
  }


  onLocationIdChange(){
    this.constractLocationId();
    this.connectionPointService.checkUniqueLocationId(this.connectionPoint.id,this.connectionPoint.locationId).subscribe(
      {
        next : (res:boolean)=>{
           this.isLocationIdUnique=res;
           console.log(this.isLocationIdUnique)
        }
      }
    )
  }



}
