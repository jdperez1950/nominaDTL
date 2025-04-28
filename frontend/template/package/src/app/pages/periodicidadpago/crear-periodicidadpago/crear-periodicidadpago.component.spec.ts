// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { CrearPeriodicidadpagoComponent } from './crear-periodicidadpago.component';
import { PeriodicidadPagoService } from '../../../services/PeriodicidadPagoService';

/**
 * Suite de pruebas para el componente CrearPeriodicidadpago
 */
describe('CrearPeriodicidadpagoComponent', () => {
  // Variables para el componente y su fixture
  let component: CrearPeriodicidadpagoComponent;
  let fixture: ComponentFixture<CrearPeriodicidadpagoComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPeriodicidadpagoComponent ],
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
    fixture = TestBed.createComponent(CrearPeriodicidadpagoComponent);
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
