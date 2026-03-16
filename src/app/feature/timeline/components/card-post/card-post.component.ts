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
@Component({
  selector: 'app-card-post',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    CommentCardComponent,
    AddCommentComponent,
    DatePipe,
  ],
  templateUrl: './card-post.component.html',
  styleUrl: './card-post.component.css',
})
export class CardPostComponent {
  public readonly timeLineServices = inject(TimelineService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastrService);
  post = input.required<Post>();
  editingPost = output<Post>();
  ShowAllComments = signal<boolean>(false);
  isEdit = this.timeLineServices.edit;
  commentObj!: Comment;
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
    this.timeLineServices.getAllComments(postId).subscribe({
      next: (resp) => {
        // this.comments.emit({ comments: resp.data.comments });
        this.timeLineServices.AllComments.set(resp.data);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
  toggleComments(postID: string) {
    this.ShowAllComments.set(!this.ShowAllComments());

    if (this.ShowAllComments()) {
      this.getCommentsByPostId(postID);
    }
  }
}
