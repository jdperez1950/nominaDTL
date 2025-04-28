// Importaciones de módulos de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
// Importaciones del componente y servicio a probar
import { LeerTipocontratoComponent } from './leer-tipocontrato.component';
import { TipoContratoService } from '../../../services/TipoContratoService';

/**
 * Suite de pruebas para el componente LeerTipocontrato
 */
describe('LeerTipocontratoComponent', () => {
  // Variables para el componente y su fixture
  let component: LeerTipocontratoComponent;
  let fixture: ComponentFixture<LeerTipocontratoComponent>;

  /**
   * Configuración asíncrona del entorno de pruebas
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerTipocontratoComponent ],
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
    fixture = TestBed.createComponent(LeerTipocontratoComponent);
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
