// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { EliminarCuentacobroComponent } from './eliminar-cuentacobro.component';
import { CuentaCobroService } from '../../../services/CuentaCobroService';

/**
 * Suite de pruebas para el componente EliminarCuentacobro
 */
describe('EliminarCuentacobroComponent', () => {
  // Variables para el componente y su fixture
  let component: EliminarCuentacobroComponent;
  let fixture: ComponentFixture<EliminarCuentacobroComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarCuentacobroComponent ],
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
    fixture = TestBed.createComponent(EliminarCuentacobroComponent);
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
