import { inject, Injectable, signal } from '@angular/core';
import { sign } from 'crypto';
import { Comments2, IAllPosts, Posts } from '../interfaces/IAllPosts';
import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { HttpErrorResponse } from '@angular/common/http';
import { IAllComments } from '../interfaces/IAllComments';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TimelineService extends BaseHttpServices {
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastrService);
  allPosts = signal<Posts[]>([]);
  editID = signal<string>('');
  postUser = signal<Posts[]>([]);
  AllComments = signal<Comments2[]>([]);
  isLoadingState = signal<boolean>(false);
  editingPost = signal<Posts | null>(null);
  edit = signal<boolean>(false);
  // posts
  getAllPosts(filter: {}) {
    if (this.isLoadingState()) return;
    this.isLoadingState.set(true);
    return this.httpClient
      .get<IAllPosts>(`${APP_APIS.POSTS.posts}`, {
        params: filter,
      })
      .subscribe({
        next: (resp) => {
          this.isLoadingState.set(false);
          this.allPosts.update((value) => [...value, ...resp.posts]);
        },
      });
  }
  // refresh posts
  refreshAllPosts(filter: {}) {
    if (this.isLoadingState()) return;
    this.isLoadingState.set(true);
    return this.httpClient
      .get<IAllPosts>(`${APP_APIS.POSTS.posts}`, {
        params: filter,
      })
      .subscribe({
        next: (resp) => {
          this.isLoadingState.set(false);

          this.allPosts.set(resp.posts);
        },
      });
  }
  // add
  addNewPost(formData: FormData) {
    return this.httpClient.post(APP_APIS.POSTS.posts, formData).subscribe({
      next: (resp) => {
        this.allPosts.set([]);
        this.refreshAllPosts({
          limit: 5,
          sort: '-createdAt',
          page: 1,
        });
        this.toast.success('Your Post has been added successfully!', '', {
          progressBar: true,
        });
        this.dialog.closeAll();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.error);
      },
    });
  }
  // delete post
  deletePost(postID: string) {
    return this.httpClient.delete(`${APP_APIS.POSTS.posts}/${postID}`);
  }
  // edit posts
  updatePosts(postId: string, postUpdate: FormData) {
    return this.httpClient.put<any>(`${APP_APIS.POSTS.posts}/${postId}`, postUpdate);
  }
  // comments
  addComment(commentData: {}) {
    return this.httpClient.post<IAllComments>(APP_APIS.Comments.comment, commentData);
  }
  // edit comment
  editComment(idComment: string, newContent: {}) {
    return this.httpClient.put<Comments2>(`${APP_APIS.Comments.comment}/${idComment}`, newContent);
  }
  // get Comments by post Id
  getAllComments(postID: string) {
    return this.httpClient.get<IAllComments>(`${APP_APIS.POSTS.posts}/${postID}/comments`);
  }
  // get posts by userID
  getPostsUser(userID: string) {
    return this.httpClient.get<IAllPosts>(`${environment.baseUrl}users/${userID}/posts`).subscribe({
      next: (resp) => {
        this.postUser.set(resp.posts);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
  // delete comment
  deleteComment(commentID: string) {
    return this.httpClient.delete(`${APP_APIS.Comments.comment}/${commentID}`);
  }
}
