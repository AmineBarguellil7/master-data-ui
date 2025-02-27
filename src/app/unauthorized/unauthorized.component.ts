import { KeycloakService } from 'keycloak-angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
 
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent implements OnInit {
  constructor(private  kc :KeycloakService){}
  ngOnInit(): void {
  }
  logout():void{
    this.kc.logout(window.location.origin)
  }

}
