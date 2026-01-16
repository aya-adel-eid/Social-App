import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { SkeltonLoadingPostsComponent } from '../../../timeline/components/skelton-loading-posts/skelton-loading-posts.component';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    ReactiveFormsModule,
    UserInfoComponent,
    CardPostComponent,
    SkeltonLoadingPostsComponent,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export class UserProfilePageComponent implements OnInit {
  private readonly authServices = inject(AuthService);
  private readonly timeLineServices = inject(TimelineService);
  private readonly platId = inject(PLATFORM_ID);
  userInfo = this.authServices.userData;
  postsUser = this.timeLineServices.postUser;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      this.getUserInfo();
      this.getPostsUser();
    }
  }
  getUserInfo() {
    this.authServices.getUserData();
  }
  getPostsUser() {
    this.timeLineServices.getPostsUser(localStorage.getItem(STORED_KEYS.userId)!);
  }
}
