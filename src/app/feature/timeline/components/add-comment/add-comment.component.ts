import { Component, inject, input, OnChanges, OnInit, output, signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TimelineService } from '../../services/timeline.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Comments2 } from '../../interfaces/IAllPosts';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-add-comment',
  imports: [MatCard, MatCardContent, ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent implements OnChanges {
  private readonly timelineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  postID = input<string>();
  commentsArr = signal<Comments2[]>([]);
  editingComment = input<Comments2>();
  comments = output<Comments2[]>();
  // control
  commentInput = new FormControl();
  restControl() {
    this.commentInput.setValue('');
  }
  ngOnChanges(): void {
    if (this.editingComment()) {
      this.commentInput.patchValue(this.editingComment()?.content);
    }
  }

  // addNewComment
  sendComment() {
    if (this.editingComment()) {
      this.timelineServices
        .editComment(this.editingComment()?._id ?? '', {
          content: this.commentInput.value,
        })
        .subscribe({
          next: (resp) => {
            this.getCommentsById(this.postID()!);
            this.toast.success('Your comment has been updated successfully!', '', {
              progressBar: true,
            });
            this.restControl();
          },
          error: (error: HttpErrorResponse) => {
            this.toast.error(error.error.error, '', {
              progressBar: true,
            });
          },
        });
    } else {
      this.timelineServices
        .addComment({
          content: this.commentInput.value,
          post: this.postID(),
        })
        .subscribe({
          next: (resp) => {
            this.comments.emit(resp.comments);
            this.commentsArr.set(resp.comments);
            this.toast.success('Your comment has been added successfully!', '', {
              progressBar: true,
            });
            this.restControl();
          },
          error: (err: HttpErrorResponse) => {
            this.toast.error(err.error.error);
          },
        });
    }
  }
  getCommentsById(postID: string) {
    this.timelineServices.getAllComments(postID).subscribe({
      next: (resp) => {
        this.comments.emit(resp.comments);
      },
    });
  }
}
