import { Component, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { InputFormComponent } from '../input-form/input-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-register-form',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardModule,
    ReactiveFormsModule,
    InputFormComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    RouterLink,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authServices = inject(AuthService);
  private readonly router = inject(Router);
  errorMessage = '';
  successMessage = '';
  registerForm!: FormGroup;
  count = 5;
  isLoading = signal<boolean>(false);
  constructor() {
    this.signUp();
  }
  signUp() {
    this.registerForm = this.fb.group(
      {
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
            ),
          ],
        ],
        rePassword: [null, [Validators.required]],
        dateOfBirth: [null, [Validators.required]],
        gender: [null, [Validators.required, Validators.pattern(/^(male|female)$/)]],
      },
      { Validators: this.confirmPassword }
    );
  }
  confirmPassword(control: AbstractControl) {
    if (control.get('password')?.value === control.get('rePassword')?.value) {
      return null;
    } else return { mismatch: true };
  }
  sendData() {
    this.errorMessage = '';
    this.successMessage = '';
    const payload = { ...this.registerForm.value };
    payload.dateOfBirth = payload.dateOfBirth.toISOString().split('T')[0];
    if (this.isLoading()) return;
    // if (payload.valid) {
    this.isLoading.set(true);

    this.authServices.signUp(payload).subscribe({
      next: (resp) => {
        this.isLoading.set(false);

        interval(1000)
          .pipe(take(5))
          .subscribe(() => {
            --this.count;
            if (this.count == 0) {
              this.router.navigateByUrl('/login');
            }
          });
        this.successMessage = `Account created successfully
           you will be redirect to login in${--this.count}`;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);

        this.errorMessage = err.error.error;
      },
    });
  }
  // }
}
