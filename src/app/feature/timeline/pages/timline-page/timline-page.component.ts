import { Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AddPostsComponent } from '../../components/add-posts/add-posts.component';
import { CardPostComponent } from '../../components/card-post/card-post.component';
import { TimelineService } from '../../services/timeline.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Posts } from '../../interfaces/IAllPosts';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SkeltonLoadingPostsComponent } from '../../components/skelton-loading-posts/skelton-loading-posts.component';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-timline-page',
  imports: [
    AddPostsComponent,
    MatProgressSpinnerModule,
    CardPostComponent,
    InfiniteScrollDirective,
    SkeltonLoadingPostsComponent,
  ],
  templateUrl: './timline-page.component.html',
  styleUrl: './timline-page.component.css',
})
export class TimlinePageComponent implements OnInit {
  private readonly timelineServices = inject(TimelineService);
  private readonly dialog = inject(MatDialog);
  private readonly platID = inject(PLATFORM_ID);
  allPosts = this.timelineServices.allPosts;
  postObj!: Posts;
  postLoading = this.timelineServices.isLoadingState;

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
  // scroll inifinte
  onScroll() {
    this.timelineServices.getAllPosts({ ...this.filterPosts, page: ++this.filterPosts.page });
  }
}
