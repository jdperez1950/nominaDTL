// branding.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img
          [src]="logoSrc"
          class="align-middle m-2"
          alt="logo"
          style="width: 100px; height: 100px; object-fit: contain;"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent implements OnInit {
  // private logoExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
  // private logoBasePath = './assets/images/logos/logoProyecto';
  // logoSrc: string = './assets/images/logos/logo-dark.svg'; // logo original de la plantilla
  logoSrc: string = './assets/images/logos/logoProyecto.jpg'; // logo de la app

  constructor() {}

  ngOnInit() {
    // this.setInitialLogo();
  }

  private setInitialLogo() {
    // this.tryLoadLogo(0);
  }

  // private tryLoadLogo(index: number) {
  //   if (index >= this.logoExtensions.length) {
  //     this.logoSrc = './assets/images/logos/logo-dark.svg'; // Use default logo if none found
  //     return;
  //   }
  //
  //   const path = `${this.logoBasePath}.${this.logoExtensions[index]}`;
  //   const img = new Image();
  //   img.onload = () => {
  //     this.logoSrc = path; // Set the logo if the image loads successfully
  //   };
  //   img.onerror = () => {
  //     this.tryLoadLogo(index + 1); // Try next extension on error
  //   };
  //   img.src = path;
  // }
}
