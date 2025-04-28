import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // Enlaces de ejemplo para cada columna
  companyLinks = [
    { name: 'Sobre Nosotros', url: '/login' },
    { name: 'Servicios', url: '/login' },
    { name: 'Contacto', url: '/login' },
    { name: 'Blog', url: '/login' }
  ];

  resourceLinks = [
    { name: 'Centro de Ayuda', url: '/login' },
    { name: 'FAQ', url: '/faq' },
    { name: 'Términos y Condiciones', url: '/login' },
    { name: 'Política de Privacidad', url: '/login' }
  ];

  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'fab fa-facebook' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'fab fa-instagram' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' }
  ];
}
