import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsPageComponent } from './friends-page.component';

describe('FriendsPageComponent', () => {
  let component: FriendsPageComponent;
  let fixture: ComponentFixture<FriendsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
