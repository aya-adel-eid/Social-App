import { Component, inject, input, InputSignal, output, signal } from '@angular/core';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Comments2 } from '../../interfaces/IAllPosts';
import { DatePipe } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment-card',
  imports: [MatCard, MatCardHeader, MatIconModule, MatMenuModule, MatButtonModule, DatePipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent {
  private readonly timeLineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  // send comment to parent to edit
  commentObj = output<Comments2>();
  comments = output<Comments2[]>();
  comment: InputSignal<Comments2[]> = input.required({
    transform: (data) => {
      return data.map((comment) => {
        return {
          ...comment,
          commentCreator: {
            ...comment.commentCreator,
            photo: comment.commentCreator.photo.includes('undefined')
              ? '/images/profile.png'
              : comment.commentCreator.photo,
          },
        };
      });
    },
  });
  showAllComments = input<boolean>(false);
  updateComment(commentObj: Comments2) {
    this.commentObj.emit(commentObj);
  }
  // delete your comment
  deleteComment(commentID: string, postId: string) {
    this.timeLineServices.deleteComment(commentID).subscribe({
      next: (resp) => {
        this.getCommentsByPostId(postId);
        this.toast.success('The comment has been deleted successfully!.', '', {
          progressBar: true,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.error);
      },
    });
  }
  getCommentsByPostId(postId: string) {
    this.timeLineServices.getAllComments(postId).subscribe({
      next: (resp) => {
        this.comments.emit(resp.comments);
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
