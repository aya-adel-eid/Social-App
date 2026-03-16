import { inject, Injectable, signal } from '@angular/core';
import { sign } from 'crypto';

import { BaseHttpServices } from '../../../core/services/helper/BaseHttp.service';
import { APP_APIS } from '../../../core/constance/app_Apis';
import { HttpErrorResponse } from '@angular/common/http';
import { Comment, Comments, IAllComments } from '../interfaces/IAllComments';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { IAllPosts, Post, TopComment } from '../interfaces/IAllPosts';

@Injectable({
  providedIn: 'root',
})
export class TimelineService extends BaseHttpServices {
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastrService);
  allPosts = signal<Post[]>([]);
  editID = signal<string>('');
  postUser = signal<Post[]>([]);
  // comments
  AllComments = signal<Comments>({ comments: [] });
  editingComment = signal<Comment | TopComment | null>(null);
  isLoadingState = signal<boolean>(false);
  editingPost = signal<Post | null>(null);
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
          this.allPosts.update((value) => [...value, ...resp.data.posts]);
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

          this.allPosts.set(resp.data.posts);
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
  addComment(commentData: {}, postID: string) {
    return this.httpClient.post<IAllComments>(
      `${APP_APIS.POSTS.posts}/${postID}/comments`,
      commentData,
    );
  }
  // edit comment
  editComment(idComment: string, newContent: {}, postID: string) {
    return this.httpClient.put<Comment>(
      `${APP_APIS.POSTS.posts}/${postID}/comments/${idComment}`,
      newContent,
    );
  }
  // get Comments by post Id
  getAllComments(postID: string) {
    return this.httpClient.get<IAllComments>(`${APP_APIS.POSTS.posts}/${postID}/comments`);
  }
  // get posts by userID
  getPostsUser(userID: string) {
    return this.httpClient.get<IAllPosts>(`${environment.baseUrl}users/${userID}/posts`).subscribe({
      next: (resp) => {
        this.postUser.set(resp.data.posts);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
  // delete comment
  deleteComment(commentID: string, postID: string) {
    return this.httpClient.delete(`${APP_APIS.POSTS.posts}/${postID}/comments/${commentID}`);
  }
}
