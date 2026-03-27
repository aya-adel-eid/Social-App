import { Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AddPostsComponent } from '../../components/add-posts/add-posts.component';
import { CardPostComponent } from '../../components/card-post/card-post.component';
import { TimelineService } from '../../services/timeline.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Post } from '../../interfaces/IAllPosts';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SkeltonLoadingPostsComponent } from '../../components/skelton-loading-posts/skelton-loading-posts.component';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { SharePostComponent } from '../../components/share-post/share-post.component';
import { CardPostShareComponent } from '../../components/card-post-share/card-post-share.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { ToastrService } from 'ngx-toastr';
import { SavedPostsService } from '../../../Saved/services/saved-posts.service';
import { SuggestionPageComponent } from '../../../suggestion/pages/suggestion-page/suggestion-page.component';
@Component({
  selector: 'app-timline-page',
  imports: [
    MatProgressSpinnerModule,
    CardPostComponent,
    InfiniteScrollDirective,
    SkeltonLoadingPostsComponent,
    CardPostShareComponent,
    DatePipe,
    MatMenuModule,
    MatIcon,
    SuggestionPageComponent,
  ],
  templateUrl: './timline-page.component.html',
  styleUrl: './timline-page.component.css',
})
export class TimlinePageComponent implements OnInit {
  public readonly timelineServices = inject(TimelineService);
  private readonly dialog = inject(MatDialog);
  private readonly platID = inject(PLATFORM_ID);
  allPosts = this.timelineServices.allPosts;
  private readonly toast = inject(ToastrService);
  private readonly savedPostsServices = inject(SavedPostsService);
  postObj!: Post;
  postLoading = this.timelineServices.isLoadingState;
  isEdit = this.timelineServices.edit;
  filterPosts = {
    limit: 5,
    sort: '-createdAt',
    page: 1,
  };
  ngOnInit(): void {
    //
    if (isPlatformBrowser(this.platID)) {
      this.timelineServices.getAllPosts(this.filterPosts);
    }
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
  // scroll inifinte
  onScroll() {
    this.timelineServices.getAllPosts({ ...this.filterPosts, page: ++this.filterPosts.page });
  }
  savePost(postID: string) {
    this.savedPostsServices.savePost(postID).subscribe({
      next: (resp) => {
        this.allPosts.update((posts) =>
          posts.map((post) =>
            post._id === postID ? { ...post, bookmarked: post.bookmarked } : post,
          ),
        );
        this.savedPostsServices.getAllSavedPosts();
      },
    });
  }
}
