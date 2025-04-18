import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss',
})
export class DynamicFieldComponent {
  @Input() field!: any;
  @Input() form!: FormGroup | any;

  get isMulti(): boolean {
    return this.field.isMulti === true || this.field.isMulti === 'true';
  }

  getFormArray(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }

  addMulti() {
    const array = this.form.get(this.field.fieldName) as FormArray;
    array.push(new FormControl(''));
  }

  removeMulti(index: number) {
    const array = this.form.get(this.field.fieldName) as FormArray;
    array.removeAt(index);
  }
}
