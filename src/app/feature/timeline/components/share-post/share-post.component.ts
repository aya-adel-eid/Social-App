import { Component, inject, signal } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent, MatCardFooter } from '@angular/material/card';
import { AddPostsComponent } from '../add-posts/add-posts.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../interfaces/SharePost';
import { TimelineService } from '../../services/timeline.service';
import { MatAnchor } from '@angular/material/button';
import { Dialog } from '@angular/cdk/dialog';
import { CardPostShareComponent } from '../card-post-share/card-post-share.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-share-post',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatCardFooter,
    MatAnchor,
    CardPostShareComponent,
  ],
  templateUrl: './share-post.component.html',
  styleUrl: './share-post.component.css',
})
export class SharePostComponent {
  content = new FormControl('');
  private readonly timeLineService = inject(TimelineService);
  private readonly dialog = inject(Dialog);
  private readonly toast = inject(ToastrService);
  postShare = this.timeLineService.postShared;
  sharePost() {
    this.timeLineService
      .sharePost(this.timeLineService.postShared()?._id!, this.content.value!)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.timeLineService.postShared.set(null);
          this.toast.success(resp.message, '', {
            progressBar: true,
          });
          this.closeDialog();
        },
        error: (error: HttpErrorResponse) => {
          this.toast.error(error.error.message, '', {
            progressBar: true,
          });
          this.closeDialog();
        },
      });
  }
  closeDialog() {
    this.dialog.closeAll();
    this.postShare.set(null);
  }
}
