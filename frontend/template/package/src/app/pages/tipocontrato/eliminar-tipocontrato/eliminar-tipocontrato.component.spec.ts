// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { EliminarTipocontratoComponent } from './eliminar-tipocontrato.component';
import { TipoContratoService } from '../../../services/TipoContratoService';

/**
 * Suite de pruebas para el componente EliminarTipocontrato
 */
describe('EliminarTipocontratoComponent', () => {
  // Variables para el componente y su fixture
  let component: EliminarTipocontratoComponent;
  let fixture: ComponentFixture<EliminarTipocontratoComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarTipocontratoComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ TipoContratoService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarTipocontratoComponent);
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
