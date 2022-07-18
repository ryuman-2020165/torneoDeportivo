import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesAdminComponent } from './leagues-admin.component';

describe('LeaguesAdminComponent', () => {
  let component: LeaguesAdminComponent;
  let fixture: ComponentFixture<LeaguesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguesAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
