import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionCardComponent } from './suggestion-card.component';

describe('SuggestionCardComponent', () => {
  let component: SuggestionCardComponent;
  let fixture: ComponentFixture<SuggestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
