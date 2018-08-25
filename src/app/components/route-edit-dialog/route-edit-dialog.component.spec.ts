import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEditDialogComponent } from './route-edit-dialog.component';

describe('RouteEditDialogComponent', () => {
  let component: RouteEditDialogComponent;
  let fixture: ComponentFixture<RouteEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
