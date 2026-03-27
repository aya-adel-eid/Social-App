import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPostShareComponent } from './card-post-share.component';

describe('CardPostShareComponent', () => {
  let component: CardPostShareComponent;
  let fixture: ComponentFixture<CardPostShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPostShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPostShareComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
