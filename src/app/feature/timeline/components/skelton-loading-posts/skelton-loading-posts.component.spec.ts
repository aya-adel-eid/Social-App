import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeltonLoadingPostsComponent } from './skelton-loading-posts.component';

describe('SkeltonLoadingPostsComponent', () => {
  let component: SkeltonLoadingPostsComponent;
  let fixture: ComponentFixture<SkeltonLoadingPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeltonLoadingPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeltonLoadingPostsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
