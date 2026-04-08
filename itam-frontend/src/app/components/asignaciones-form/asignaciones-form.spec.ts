import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesForm } from './asignaciones-form';

describe('AsignacionesForm', () => {
  let component: AsignacionesForm;
  let fixture: ComponentFixture<AsignacionesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
