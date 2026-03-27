import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

import { AuthService } from '../../../auth/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardFooter, MatCardContent, MatCardHeader, MatCard } from '@angular/material/card';
import { MatMenuContent } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { TimelineService } from '../../../timeline/services/timeline.service';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { UserData } from '../../../auth/interfaces/UserProfile';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { IUserInfo, User } from '../../interfaces/IUserInfo';
import { UserProfileService } from '../../services/user-profile.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-info',
  imports: [
    ReactiveFormsModule,
    MatCardFooter,
    MatCardContent,
    MatCardHeader,
    MatCard,
    MatAnchor,
    DatePipe,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  private readonly authServices = inject(AuthService);
  private readonly timeLineServices = inject(TimelineService);
  private readonly userProfile = inject(UserProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly plat_ID = inject(PLATFORM_ID);
  private readonly toast = inject(ToastrService);
  userData = input.required<IUserInfo>();
  photo = new FormControl(null, [Validators.required]);
  isLoading = signal<boolean>(false);
  changeImage = viewChild<TemplateRef<any>>('ChangeImage');
  isFollow = this.userProfile.isFollow;
  isLoad = signal<boolean>(false);
  id = signal<string>('');
  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_ID)) {
      this.id.set(localStorage.getItem(STORED_KEYS.userId)!);
    }

    // const user = this.userData();
    // if (user.data?.user._id) {
    //   this.isFollow.set(user.data?.isFollowing); // ← جيب الـ initial value من الـ userData
    // }
  }
  constructor() {
    effect(() => {
      const user = this.userData();
      if (user?.data?.isFollowing !== undefined) {
        this.isFollow.set(user.data.isFollowing);
      }
    });
  }
  selectedPhoto(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    // this.addPostForm.patchValue({ image: file });
    this.photo.setValue(event.target.files[0]);
  }
  openDialog(): void {
    this.dialog.open(this.changeImage()!, {
      width: '500px',
      height: '400px',
    });
  }
  uploadPhoto() {
    if (!this.photo.value) return;

    const formData = new FormData();
    formData.append('photo', this.photo.value);
    if (this.photo.valid) {
      this.isLoading.set(true);
      this.authServices.changeProfilePhoto(formData).subscribe({
        next: (resp) => {
          this.isLoading.set(false);
          this.authServices.getUserData();
          this.timeLineServices.getPostsUser(localStorage.getItem(STORED_KEYS.userId)!);
          this.photo.setValue(null);
          this.dialog.closeAll();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.dialog.closeAll();
        },
      });
    }
  }
  followAndUNfollow(userID: string) {
    this.isLoad.set(true);
    this.userProfile.followUser(userID).subscribe({
      next: (resp) => {
        this.isFollow.set(resp.data.following);
        this.isLoad.set(false);
        if (resp.data.following) {
          this.toast.success('You started following this user', '', {
            progressBar: true,
          });
        } else {
          this.toast.success('Unfollowed successfully', '', {
            progressBar: true,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoad.set(false);
        this.toast.error(error.error.message);
      },
    });
  }
}
