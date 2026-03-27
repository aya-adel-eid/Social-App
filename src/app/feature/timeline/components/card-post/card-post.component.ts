import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Post } from '../../interfaces/IAllPosts';
import { DatePipe } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostsComponent } from '../add-posts/add-posts.component';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { ToastrService } from 'ngx-toastr';

import { HttpErrorResponse } from '@angular/common/http';
import { Comment } from '../../interfaces/IAllComments';
import { AlertShowLikesUsersComponent } from '../alert-show-likes-users/alert-show-likes-users.component';
import { SharePostComponent } from '../share-post/share-post.component';
import { RouterLink } from '@angular/router';
import { SavedPostsService } from '../../../Saved/services/saved-posts.service';
@Component({
  selector: 'app-card-post',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CommentCardComponent,
    AddCommentComponent,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './card-post.component.html',
  styleUrl: './card-post.component.css',
})
export class CardPostComponent {
  public readonly timeLineServices = inject(TimelineService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastrService);
  private readonly savedPosts = inject(SavedPostsService);
  postID = output<string>();
  post = input.required<Post>();
  likePostCount = output<number>();
  editingPost = output<Post>();
  ShowAllComments = signal<boolean>(false);
  isEdit = this.timeLineServices.edit;
  commentObj!: Comment;
  isLike = signal<boolean>(false);
  topComment = computed(() => {
    const comments = this.timeLineServices.AllComments().comments;
    return comments.length ? comments[0] : null;
  });
  editPosts(postObj: Post) {
    // this.editingPost.emit(postObj);
    // stored in signal to share
    this.timeLineServices.editingPost.set(postObj);
    this.isEdit.set(true);

    this.openDialog();
  }
  openDialog(): void {
    this.dialog.open(AddPostsComponent, {
      width: '500px',
      height: '540px',
    });
  }

  deletePost(postId: string) {
    this.timeLineServices.deletePost(postId).subscribe({
      next: (resp) => {
        this.timeLineServices.refreshAllPosts({
          limit: 5,
          sort: '-createdAt',
          page: 1,
        });
        this.timeLineServices.getPostsUser(localStorage.getItem(STORED_KEYS.userId)!);
        this.toast.success('The Post has been deleted successfully!', '', {
          progressBar: true,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toast.error(error.error.error, '', {
          progressBar: true,
        });
      },
    });
  }
  getCommentsByPostId(postId: string) {
    this.timeLineServices.isLoadingComments.set(true);
    this.timeLineServices.getAllComments(postId).subscribe({
      next: (resp) => {
        // this.comments.emit({ comments: resp.data.comments });
        this.timeLineServices.AllComments.set(resp.data);
        this.timeLineServices.isLoadingComments.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.timeLineServices.isLoadingComments.set(false);
      },
    });
  }
  toggleComments(postID: string) {
    this.ShowAllComments.set(!this.ShowAllComments());

    if (this.ShowAllComments()) {
      this.getCommentsByPostId(postID);
    }
  }
  likePost(idPost: string) {
    this.timeLineServices.likePost(idPost).subscribe({
      next: (data) => {
        this.likePostCount.emit(data.data.likesCount);
        this.isLike.set(data.data.liked);
      },
    });
  }
  showUserLikes(postID: string) {
    this.dialog.open(AlertShowLikesUsersComponent, {
      width: '900px',
    });
    this.getPostLikes(postID);
  }
  getPostLikes(postId: string) {
    this.timeLineServices.getPostLikes(postId).subscribe({
      next: (resp) => {
        console.log(resp);
        this.timeLineServices.allPostLikes.set(resp.data.likes);
      },
    });
  }
  sharePost(post: Post) {
    this.dialog.open(SharePostComponent, {
      width: '700px',
      height: post.image ? '500px' : '300px',
    });
    this.timeLineServices.postShared.set(post);
  }
  savePost(postID: string) {
    this.savedPosts.savePost(postID).subscribe({
      next: (resp) => {
        this.post().bookmarked = resp.data.bookmarked;
        this.savedPosts.getAllSavedPosts();
      },
    });
  }
}
