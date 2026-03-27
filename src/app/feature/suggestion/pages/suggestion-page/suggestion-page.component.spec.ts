import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionPageComponent } from './suggestion-page.component';

describe('SuggestionPageComponent', () => {
  let component: SuggestionPageComponent;
  let fixture: ComponentFixture<SuggestionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
