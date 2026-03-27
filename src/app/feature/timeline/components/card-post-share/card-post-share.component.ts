import { Component, inject, input, output, signal } from '@angular/core';
import { TimelineService } from '../../services/timeline.service';
import { MatCardContent, MatCardHeader, MatCard } from '@angular/material/card';
import { Post } from '../../interfaces/IAllPosts';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';

import { AlertShowLikesUsersComponent } from '../alert-show-likes-users/alert-show-likes-users.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-card-post-share',
  imports: [
    MatCardContent,
    MatCardHeader,
    MatCard,
    CommentCardComponent,
    AddCommentComponent,
    RouterLink,
  ],
  templateUrl: './card-post-share.component.html',
  styleUrl: './card-post-share.component.css',
})
export class CardPostShareComponent {
  public readonly timeLineService = inject(TimelineService);
  likePostCount = output<number>();
  private readonly dialog = inject(Dialog);
  isLike = signal<boolean>(false);
  ShowAllComments = signal<boolean>(false);
  // postShare = this.timeLineService.postShared;
  postShare = input<Post | null>(null);
  toggleComments(postID: string) {
    this.ShowAllComments.set(!this.ShowAllComments());

    if (this.ShowAllComments()) {
      this.getCommentsByPostId(postID);
    }
  }
  likePost(idPost: string) {
    this.timeLineService.likePost(idPost).subscribe({
      next: (comment) => {
        this.likePostCount.emit(comment.data.likesCount);
        this.isLike.set(comment.data.liked);
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
    this.timeLineService.getPostLikes(postId).subscribe({
      next: (resp) => {
        console.log(resp);
        this.timeLineService.allPostLikes.set(resp.data.likes);
      },
    });
  }
  // sharePost(post: Post) {
  //   this.dialog.open(SharePostComponent, {
  //     width: '700px',
  //     height: '500px',
  //   });
  //   this.timeLineService.postShared.set(post);
  // }
  getCommentsByPostId(postId: string) {
    this.timeLineService.isLoadingComments.set(true);
    this.timeLineService.getAllComments(postId).subscribe({
      next: (resp) => {
        // this.comments.emit({ comments: resp.data.comments });
        this.timeLineService.AllComments.set(resp.data);
        this.timeLineService.isLoadingComments.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.timeLineService.isLoadingComments.set(false);
      },
    });
  }
}
