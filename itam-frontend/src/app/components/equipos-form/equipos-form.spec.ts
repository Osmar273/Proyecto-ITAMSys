import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposForm } from './equipos-form';

describe('EquiposForm', () => {
  let component: EquiposForm;
  let fixture: ComponentFixture<EquiposForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EquiposForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
