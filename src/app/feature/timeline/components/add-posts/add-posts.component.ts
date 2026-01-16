import {
  Component,
  effect,
  inject,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCard, MatCardHeader, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatAnchor } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { error, log } from 'console';
import { TimelineService } from '../../services/timeline.service';
import { Posts } from '../../interfaces/IAllPosts';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-posts',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardFooter, MatAnchor, ReactiveFormsModule],
  templateUrl: './add-posts.component.html',
  styleUrl: './add-posts.component.css',
})
export class AddPostsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly timeLineServices = inject(TimelineService);
  private readonly toast = inject(ToastrService);
  isEdit = this.timeLineServices.edit;
  addPost = viewChild<TemplateRef<any>>('createPost');

  addPostForm!: FormGroup;
  // postUpdate = input<Posts>();
  // postUpdate = this.timeLineServices.editingPost;

  postUpdate = this.timeLineServices.editingPost;

  constructor() {
    this.AddPostFun();
    effect(() => {
      const post = this.postUpdate();

      if (post) {
        this.addPostForm.patchValue({
          body: post.body,
          image: post.image,
        });
      } else this.restForm();
    });
  }
  AddPostFun() {
    this.addPostForm = this.fb.group({
      body: [, [Validators.required]],
      image: [],
    });
  }
  restForm() {
    this.addPostForm.reset({
      body: '',
      image: null,
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
  imageFile(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];

    this.addPostForm.get('image')?.setValue(event.target.files[0]);
  }
  sendPost() {
    // const formObj = this.addPostForm.value;
    const formData = new FormData();

    formData.append('body', this.addPostForm.get('body')?.value);

    const image = this.addPostForm.get('image')?.value;
    if (image instanceof File) {
      formData.append('image', image);
    }

    this.timeLineServices.addNewPost(formData);
    this.timeLineServices.editingPost.set(null);
    this.restForm();
  }
  updatePost() {
    const formData = new FormData();

    formData.append('body', this.addPostForm.get('body')?.value);

    const image = this.addPostForm.get('image')?.value;
    if (image instanceof File) {
      formData.append('image', image);
    }
    this.timeLineServices.updatePosts(this.postUpdate()?._id!, formData).subscribe({
      next: (resp) => {
        this.timeLineServices.refreshAllPosts({
          limit: 5,
          sort: '-createdAt',
          page: 1,
        });
        this.toast.success('Your post has been updated successfully!', '', {
          progressBar: true,
        });
        this.isEdit.set(false);
        this.timeLineServices.getPostsUser(localStorage.getItem(STORED_KEYS.userId)!);
        this.timeLineServices.editingPost.set(null);
        this.restForm();
        this.closeDialog();
      },
      error: (error: HttpErrorResponse) => {
        this.toast.error(error.error.error, '', {
          progressBar: true,
        });
      },
    });
  }
}
