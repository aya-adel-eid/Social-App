import { TestBed } from '@angular/core/testing';

import { SavedPostsService } from './saved-posts.service';

describe('SavedPostsService', () => {
  let service: SavedPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedPostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
