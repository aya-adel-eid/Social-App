import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InputFormComponent } from '../input-form/input-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, take } from 'rxjs';
import { STORED_KEYS } from '../../../../core/constance/Stored_Keys';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, InputFormComponent, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private readonly router = inject(Router);
  private readonly authServices = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  isLoading = signal<boolean>(false);
  successMessage = '';
  errorMessage = '';
  count = 5;
  signInForm!: FormGroup;
  constructor() {
    this.sigInFun();
  }
  sigInFun() {
    this.signInForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
  sendData() {
    this.successMessage = '';
    this.errorMessage = '';
    this.signInForm.markAllAsTouched();
    if (this.isLoading()) return;
    if (this.signInForm.valid) {
      this.isLoading.set(true);

      this.authServices.signIn(this.signInForm.value).subscribe({
        next: (resp) => {
          this.isLoading.set(false);
          // navigate
          interval(1000)
            .pipe(take(5))
            .subscribe(() => {
              --this.count;
              if (this.count == 0) {
                this.router.navigateByUrl('/timeline');
              }
            });
          // verify token
          this.authServices.decodeToken(resp.token);
          localStorage.setItem(STORED_KEYS.token, resp.token);
          this.successMessage = `${resp.message}${this.count}`;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);

          this.errorMessage = err.error.error;
        },
      });
    }
  }
}
