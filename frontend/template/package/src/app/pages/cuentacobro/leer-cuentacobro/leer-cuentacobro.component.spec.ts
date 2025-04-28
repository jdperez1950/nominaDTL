// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { LeerCuentacobroComponent } from './leer-cuentacobro.component';
import { CuentaCobroService } from '../../../services/CuentaCobroService';

/**
 * Suite de pruebas para el componente LeerCuentacobro
 */
describe('LeerCuentacobroComponent', () => {
  // Variables para el componente y su fixture
  let component: LeerCuentacobroComponent;
  let fixture: ComponentFixture<LeerCuentacobroComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerCuentacobroComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ CuentaCobroService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LeerCuentacobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test básico para verificar la creación del componente
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
