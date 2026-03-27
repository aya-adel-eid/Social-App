import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { error } from 'node:console';
import {
  catchError,
  concatMap,
  debounce,
  debounceTime,
  distinct,
  distinctUntilChanged,
  every,
  filter,
  find,
  first,
  forkJoin,
  from,
  interval,
  map,
  mergeAll,
  mergeMap,
  of,
  retry,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  throwError,
  timer,
} from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { TimelineService } from '../../../timeline/services/timeline.service';
import { CardPostComponent } from '../../../timeline/components/card-post/card-post.component';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { SkeltonLoadingPostsComponent } from '../../../timeline/components/skelton-loading-posts/skelton-loading-posts.component';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { IUserInfo, User } from '../../interfaces/IUserInfo';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CardPostShareComponent } from '../../../timeline/components/card-post-share/card-post-share.component';
import { Post } from '../../../timeline/interfaces/IAllPosts';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddPostsComponent } from '../../../timeline/components/add-posts/add-posts.component';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    ReactiveFormsModule,
    UserInfoComponent,
    CardPostComponent,
    SkeltonLoadingPostsComponent,
    MatMenuModule,
    MatIcon,
    CardPostShareComponent,
    DatePipe,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent implements OnInit {
  private readonly authServices = inject(AuthService);
  public readonly timeLineServices = inject(TimelineService);
  private readonly platId = inject(PLATFORM_ID);
  isLoading = signal<boolean>(true);
  // userInfo = this.authServices.userData;
  userInfo = signal<IUserInfo | null>(null);
  postsUser = this.timeLineServices.postUser;
  private readonly activateRouter = inject(ActivatedRoute);
  private readonly userProfile = inject(UserProfileService);
  private readonly toast = inject(ToastrService);
  isEdit = this.timeLineServices.edit;
  private readonly dialog = inject(MatDialog);
  userID!: string;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
    }
  }
  constructor() {
    this.activateRouter.paramMap.subscribe((param) => {
      this.userID = param.get('id')!;
      if (isPlatformBrowser(this.platId)) {
        this.getUserInfo(this.userID);
        this.getPostsUser(this.userID!);
      }
    });
  }
  openDialog(): void {
    this.timeLineServices.editingPost.set(null);
    this.dialog.open(AddPostsComponent, {
      width: '500px',
      height: '540px',
    });
  }
  getUserInfo(userID: string) {
    // this.authServices.getUserData();
    this.userProfile.getUserProfile(userID).subscribe({
      next: (userInfo) => {
        this.isLoading.set(false);
        this.userInfo.set(userInfo);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
      },
    });
  }
  getPostsUser(userID: string) {
    this.timeLineServices.getPostsUser(userID!);
  }
  editPosts(postObj: Post) {
    // this.editingPost.emit(postObj);
    // stored in signal to share
    this.timeLineServices.editingPost.set(postObj);
    this.isEdit.set(true);

    this.openDialog();
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
}
