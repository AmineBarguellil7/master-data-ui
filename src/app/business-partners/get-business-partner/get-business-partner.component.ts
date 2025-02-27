import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-get-business-partner",
  templateUrl: "./get-business-partner.component.html",
  styleUrl: "./get-business-partner.component.scss",
})
export class GetBusinessPartnerComponent implements OnInit {
  id: string | null = null;
  updateMode: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id && this.id != "add") {
      this.updateMode = true;
    }
  }

  isDetails: boolean = true;
  isConnectionPoints: boolean = false;
  isContracts: boolean = false;

  toDetails(): void {
    if (!this.isDetails) {
      this.isConnectionPoints = false;
      this.isContracts = false;
      this.isDetails = true;
    }
  }
  toConnectionPoints(): void {
    if (!this.isConnectionPoints) {
      this.isContracts = false;
      this.isDetails = false;
      this.isConnectionPoints = true;
    }
  }
  toContracts(): void {
    if (!this.isContracts) {
      this.isDetails = false;
      this.isConnectionPoints = false;
      this.isContracts = true;
    }
  }
}
