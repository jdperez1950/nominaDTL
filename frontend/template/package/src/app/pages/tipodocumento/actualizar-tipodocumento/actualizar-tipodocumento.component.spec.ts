// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { ActualizarTipodocumentoComponent } from './actualizar-tipodocumento.component';
import { TipoDocumentoService } from '../../../services/TipoDocumentoService';

/**
 * Suite de pruebas para el componente ActualizarTipodocumento
 */
describe('ActualizarTipodocumentoComponent', () => {
  // Variables para el componente y su fixture
  let component: ActualizarTipodocumentoComponent;
  let fixture: ComponentFixture<ActualizarTipodocumentoComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarTipodocumentoComponent ],
      imports: [ 
        ReactiveFormsModule,      // Para manejo de formularios reactivos
        FormlyModule.forRoot()    // Para formularios dinámicos
      ],
      providers: [ TipoDocumentoService ]  // Servicio necesario
    })
    .compileComponents();
  });

  /**
   * Creación y configuración del componente antes de cada test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarTipodocumentoComponent);
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
