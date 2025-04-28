// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { LeerPeriodicidadpagoComponent } from './leer-periodicidadpago.component';
import { PeriodicidadPagoService } from '../../../services/PeriodicidadPagoService';

/**
 * Suite de pruebas para el componente LeerPeriodicidadpago
 */
describe('LeerPeriodicidadpagoComponent', () => {
  // Variables para el componente y su fixture
  let component: LeerPeriodicidadpagoComponent;
  let fixture: ComponentFixture<LeerPeriodicidadpagoComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerPeriodicidadpagoComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ PeriodicidadPagoService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LeerPeriodicidadpagoComponent);
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
