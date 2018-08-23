import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSearcherComponent } from './route-searcher.component';

describe('RouteSearcherComponent', () => {
  let component: RouteSearcherComponent;
  let fixture: ComponentFixture<RouteSearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteSearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
