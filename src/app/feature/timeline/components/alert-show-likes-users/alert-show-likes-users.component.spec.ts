import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertShowLikesUsersComponent } from './alert-show-likes-users.component';

describe('AlertShowLikesUsersComponent', () => {
  let component: AlertShowLikesUsersComponent;
  let fixture: ComponentFixture<AlertShowLikesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertShowLikesUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertShowLikesUsersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
