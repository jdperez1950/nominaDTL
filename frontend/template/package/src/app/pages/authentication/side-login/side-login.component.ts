import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule , ActivatedRoute} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {LoginTradicionalComponent} from "./login-tradicional/login-tradicional.component";

import {
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { MatCardModule } from '@angular/material/card';
import {environment} from "../../../../environments/environment";
import {PermissionService} from "../services/PermissionService";
@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    LoginTradicionalComponent

  ],
  templateUrl: './side-login.component.html',
  providers: [
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          }
        ]
      }
    }
  ]
})
export class AppSideLoginComponent  implements OnInit{
  private logoExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg']; // Extensiones en orden de preferencia
  // private logoBasePath = './assets/images/logos/logoProyecto';
  // logoSrc: string;
  logoSrc: string = './assets/images/logos/logoProyecto.jpg';
  constructor() {
     // this.setInitialLogo();
  }
  ngOnInit() {}
  // private setInitialLogo() {
  //   this.tryLoadLogo(0);
  // }
  // private tryLoadLogo(index: number) {
  //   if (index >= this.logoExtensions.length) {
  //     this.logoSrc = './assets/images/logos/logo-dark.svg'; // Logo por defecto si ninguna extensión funciona
  //     return;
  //   }
  //   const path = `${this.logoBasePath}.${this.logoExtensions[index]}`;
  //   const img = new Image();
  //   img.onload = () => {
  //     this.logoSrc = path; // Establece el logo si la imagen carga correctamente
  //   };
  //   img.onerror = () => {
  //     this.tryLoadLogo(index + 1); // Intenta con la siguiente extensión si hay error
  //   };
  //   img.src = path;
  // }
}
