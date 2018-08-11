import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteMyroutesComponent } from './route-myroutes.component';

describe('RouteMyroutesComponent', () => {
  let component: RouteMyroutesComponent;
  let fixture: ComponentFixture<RouteMyroutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteMyroutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteMyroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
