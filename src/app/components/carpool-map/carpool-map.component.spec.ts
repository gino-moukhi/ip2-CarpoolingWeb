import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolMapComponent } from './carpool-map.component';

describe('CarpoolMapComponent', () => {
  let component: CarpoolMapComponent;
  let fixture: ComponentFixture<CarpoolMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarpoolMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarpoolMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
