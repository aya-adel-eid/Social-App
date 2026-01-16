import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { InputFormComponent } from '../../components/input-form/input-form.component';
import { MatAnchor } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';

@Component({
  selector: 'app-change-password',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    InputFormComponent,
    MatAnchor,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authServices = inject(AuthService);
  changePasswordForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  constructor() {
    this.ChangePasswordFun();
  }
  isLoading = signal<boolean>(false);
  ChangePasswordFun() {
    this.changePasswordForm = this.fb.group({
      password: [
        ,
        [
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
          ),
          Validators.required,
        ],
      ],
      newPassword: [
        ,
        [
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
          ),
          Validators.required,
        ],
      ],
    });
  }
  updatePassword() {
    this.changePasswordForm.markAllAsTouched();
    this.successMessage = '';
    this.errorMessage = '';
    if (this.isLoading()) return;
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);
      this.authServices.changePassword(this.changePasswordForm.value).subscribe({
        next: (resp) => {
          this.isLoading.set(false);
          this.successMessage = resp.message;
          localStorage.setItem(STORED_KEYS.token, resp.token);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage = error.error.error;
        },
      });
    }
  }
}
