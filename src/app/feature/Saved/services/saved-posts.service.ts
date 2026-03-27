import { Injectable, signal } from '@angular/core';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { ISavePost } from '../../timeline/interfaces/ISavePost';
import { IAllPosts, Post } from '../../timeline/interfaces/IAllPosts';

import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SavedPostsService extends BaseHttpServices {
  allSavedPosts = signal<Post[]>([]);
  isLoading = signal<boolean>(true);
  savePost(postID: string) {
    return this.httpClient.put<ISavePost>(`${APP_APIS.POSTS.posts}/${postID}/bookmark`, {});
  }
  getAllSavedPosts() {
    return this.httpClient.get<IAllPosts>(`${APP_APIS.AUTH.users}/bookmarks`).subscribe({
      next: (resp) => {
        this.allSavedPosts.set(resp.data.bookmarks);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
      },
    });
  }
}
