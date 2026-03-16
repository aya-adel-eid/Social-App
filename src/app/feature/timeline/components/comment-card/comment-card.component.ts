import {
  Component,
  inject,
  Input,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AddCommentComponent } from '../add-comment/add-comment.component';

import { DatePipe } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Comment, Comments } from '../../interfaces/IAllComments';
import { TopComment } from '../../interfaces/IAllPosts';

@Component({
  selector: 'app-comment-card',
  imports: [MatCard, MatCardHeader, MatIconModule, MatMenuModule, MatButtonModule, DatePipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent implements OnInit {
  public readonly timeLineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  // send comment to parent to edit
  commentObj = output<Comment | TopComment>();
  comments = output<Comments>();
  topComment = input<TopComment | null>();
  comment = this.timeLineServices.AllComments;
  postID = input<string>();
  // comment: InputSignal<Comments> = input.required({
  //   transform: (data: Comments) => {
  //     return {
  //       comments: data.comments.map((comment: Comment) => {
  //         return {
  //           ...comment,
  //           commentCreator: {
  //             ...comment.commentCreator,
  //             photo: comment.commentCreator.photo.includes('undefined')
  //               ? '/images/profile.png'
  //               : comment.commentCreator.photo,
  //           },
  //         };
  //       }),
  //     };
  //   },
  // });
  showAllComments = input<boolean>(false);
  ngOnInit(): void {
    this.getCommentsByPostId(this.postID()!);
  }
  updateComment(commentObj: Comment | TopComment) {
    // this.commentObj.emit(commentObj);
    console.log(commentObj);

    this.timeLineServices.editingComment.set(commentObj);
  }
  // delete your comment
  deleteComment(commentID: string, postId: string) {
    this.timeLineServices.deleteComment(commentID, postId).subscribe({
      next: (resp) => {
        this.getCommentsByPostId(postId);
        this.timeLineServices.allPosts.update((posts) =>
          posts.map((p) =>
            p._id === this.postID()
              ? {
                  ...p,
                  commentsCount: p.commentsCount > 0 ? p.commentsCount - 1 : 0,
                }
              : p,
          ),
        );
        this.toast.success('The comment has been deleted successfully!.', '', {
          progressBar: true,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error.message);
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
}
