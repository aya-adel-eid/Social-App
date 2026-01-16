import { Component, forwardRef, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatInput } from '@angular/material/input';

@Component({
  selector: 'app-input-form',
  imports: [MatFormFieldModule, MatInputModule, MatInput, ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFormComponent),
      multi: true,
    },
  ],
})
export class InputFormComponent implements ControlValueAccessor {
  control = input<AbstractControl | null>(null);
  type = input<string>('text');
  label = input<string>('');
  idInput = input<string>('');
  placeholder = input<string>('');
  group = input<FormGroup | null>(null);
  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};
  disabled = false;
  writeValue(obj: any): void {
    this.value = obj ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  flag = signal<boolean>(false);
  toggle() {
    if (
      this.idInput() == 'password' ||
      this.idInput() == 'rePassword' ||
      this.idInput() == 'newPassword'
    ) {
      this.flag.set(!this.flag());
    }
  }
}
