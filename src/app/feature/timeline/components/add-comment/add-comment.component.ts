import { Component, effect, inject, input, OnChanges, OnInit, output, signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TimelineService } from '../../services/timeline.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { Comment, Comments } from '../../interfaces/IAllComments';

@Component({
  selector: 'app-add-comment',
  imports: [MatCard, MatCardContent, ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  private readonly timelineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  postID = input<string>();
  commentsArr = signal<Comments>;
  // editingComment = input<Comment>();
  editingComment = this.timelineServices.editingComment;
  comments = output<Comments>();
  // control
  commentInput = new FormControl();
  restControl() {
    this.commentInput.setValue('');
  }
  // ngOnChanges(): void {
  //   if (this.editingComment()) {
  //     this.commentInput.patchValue(this.editingComment()?.content);
  //   }
  // }
  constructor() {
    effect(() => {
      if (this.editingComment() && this.editingComment()?.post === this.postID()) {
        this.commentInput.patchValue(this.editingComment()?.content);
      }
    });
  }

  // addNewComment
  sendComment() {
    if (this.editingComment()) {
      this.timelineServices
        .editComment(
          this.editingComment()?._id ?? '',
          {
            content: this.commentInput.value,
          },
          this.editingComment()?.post!,
        )
        .subscribe({
          next: (resp) => {
            this.getCommentsById(this.editingComment()?.post!);
            this.toast.success('Your comment has been updated successfully!', '', {
              progressBar: true,
            });
            this.restControl();
          },
          error: (error: HttpErrorResponse) => {
            this.editingComment.set(null);
            this.restControl();
            this.toast.error(error.error.message, '', {
              progressBar: true,
            });
          },
        });
    } else {
      this.timelineServices
        .addComment(
          {
            content: this.commentInput.value,
          },
          this.postID()!,
        )
        .subscribe({
          next: (resp) => {
            this.getCommentsById(this.postID()!);
            this.timelineServices.allPosts.update((posts) =>
              posts.map((p) =>
                p._id === this.postID()
                  ? {
                      ...p,
                      commentsCount: p.commentsCount + 1,
                      topComment: resp.data.comments?.[0],
                    }
                  : p,
              ),
            );
            // this.comments.emit({ comments: resp.data.comments });
            // this.commentsArr.set({comments:resp.data.comments});
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
        // this.comments.emit({ comments: resp.data.comments });
        this.timelineServices.AllComments.set(resp.data);
        console.log(this.timelineServices.AllComments().comments);
      },
    });
  }
}
