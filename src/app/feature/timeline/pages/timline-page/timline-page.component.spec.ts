import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimlinePageComponent } from './timline-page.component';

describe('TimlinePageComponent', () => {
  let component: TimlinePageComponent;
  let fixture: ComponentFixture<TimlinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimlinePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimlinePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
