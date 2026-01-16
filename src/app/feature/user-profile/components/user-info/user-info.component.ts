import { Component, inject, input, signal, TemplateRef, viewChild } from '@angular/core';
import { User } from '../../../auth/interfaces/IUserInfo';
import { AuthService } from '../../../auth/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardFooter, MatCardContent, MatCardHeader, MatCard } from '@angular/material/card';
import { MatMenuContent } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatAnchor } from '@angular/material/button';
import { TimelineService } from '../../../timeline/services/timeline.service';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
@Component({
  selector: 'app-user-info',
  imports: [ReactiveFormsModule, MatCardFooter, MatCardContent, MatCardHeader, MatCard, MatAnchor],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  private readonly authServices = inject(AuthService);
  private readonly timeLineServices = inject(TimelineService);
  private readonly dialog = inject(MatDialog);
  userData = input.required<User>();
  photo = new FormControl(null, [Validators.required]);
  isLoading = signal<boolean>(false);
  changeImage = viewChild<TemplateRef<any>>('ChangeImage');
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
}
