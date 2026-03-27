import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SavedPostsService } from '../../services/saved-posts.service';
import { Post } from '../../../timeline/interfaces/IAllPosts';
import { CardPostComponent } from '../../../timeline/components/card-post/card-post.component';
import { SkeltonLoadingPostsComponent } from '../../../timeline/components/skelton-loading-posts/skelton-loading-posts.component';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { CardPostShareComponent } from '../../../timeline/components/card-post-share/card-post-share.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TimelineService } from '../../../timeline/services/timeline.service';
import { ToastrService } from 'ngx-toastr';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { AddPostsComponent } from '../../../timeline/components/add-posts/add-posts.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-saved-post',
  imports: [
    CardPostComponent,
    SkeltonLoadingPostsComponent,
    CardPostShareComponent,
    MatMenuModule,
    MatIcon,
    DatePipe,
  ],
  templateUrl: './saved-post.component.html',
  styleUrl: './saved-post.component.css',
})
export class SavedPostComponent implements OnInit {
  private readonly savedPostsServices = inject(SavedPostsService);
  allSavedPosts = this.savedPostsServices.allSavedPosts;
  isLoading = this.savedPostsServices.isLoading;
  private readonly plat_Id = inject(PLATFORM_ID);
  private readonly timelineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  isEdit = this.timelineServices.edit;
  private readonly dialog = inject(MatDialog);
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_Id)) {
      this.getAllSavedPosts();
    }
  }
  getAllSavedPosts() {
    this.savedPostsServices.getAllSavedPosts();
  }
  deletePost(postId: string) {
    this.timelineServices.deletePost(postId).subscribe({
      next: (resp) => {
        this.timelineServices.refreshAllPosts({
          limit: 5,
          sort: '-createdAt',
          page: 1,
        });
        this.timelineServices.getPostsUser(localStorage.getItem(STORED_KEYS.userId)!);
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
  openDialog(): void {
    this.timelineServices.editingPost.set(null);
    this.dialog.open(AddPostsComponent, {
      width: '500px',
      height: '540px',
    });
  }
  editPosts(postObj: Post) {
    // this.editingPost.emit(postObj);
    // stored in signal to share
    this.timelineServices.editingPost.set(postObj);
    this.isEdit.set(true);

    this.openDialog();
  }
  savePost(postID: string) {
    this.savedPostsServices.savePost(postID).subscribe({
      next: (resp) => {
        this.allSavedPosts.update((posts) =>
          posts.map((post) =>
            post._id === postID ? { ...post, bookmarked: post.bookmarked } : post,
          ),
        );
        this.savedPostsServices.getAllSavedPosts();
      },
    });
  }
}
