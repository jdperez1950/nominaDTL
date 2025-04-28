import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRolARolComponent } from './asignar-rol-a-rol.component';

describe('AsignarRolARolComponent', () => {
  let component: AsignarRolARolComponent;
  let fixture: ComponentFixture<AsignarRolARolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarRolARolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarRolARolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
