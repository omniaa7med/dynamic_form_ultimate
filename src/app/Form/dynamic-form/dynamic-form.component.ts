import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicGroupComponent } from '../dynamic-group/dynamic-group.component';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicGroupComponent,
    DynamicFieldComponent,
  ],
  templateUrl: './dynamic-form.component.html',
  styles: '',
})
export class DynamicFormComponent {
  form!: FormGroup;
  testData: any;
  groupedFields: Record<string, any[]> = {};
  flatFields: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('assets/data/tabletest2.json').subscribe((data) => {
      this.testData = data;
      // console.log(this.testData);
      this.buildDynamicForm(this.testData.fieldName);
      this.form = this.fb.group({
        ID: [null],
        ...this.handleFlatFields(),
        ...this.handleGroupFields(),
      });
    });
  }

  buildDynamicForm(fields: any[]) {
    fields.forEach((field) => {
      const group = field.Group;
      if (!group) {
        this.flatFields.push(field);
      } else {
        if (!this.groupedFields[group]) {
          this.groupedFields[group] = [];
        }
        this.groupedFields[group].push(field);
      }
    });
  }

  handleGroupFields(): any {
    const groups: { [key: string]: FormArray } = {};
    Object.keys(this.groupedFields).forEach((groupKey: any) => {
      const fieldGroup = this.groupedFields[groupKey];
      const createGroup = (): FormGroup => {
        const fg: { [key: string]: FormControl } = {};
        fieldGroup.forEach((field) => {
          const validators = field.mandatory ? [Validators.required] : [];
          fg[field.fieldName] = this.fb.control(null, validators);
        });
        return this.fb.group(fg);
      };

      groups[groupKey] = this.fb.array([createGroup()]);
    });

    return groups;
  }

  handleFlatFields() {
    const flatField: { [key: string]: any } = {};

    this.flatFields.forEach((field) => {
      const validators = field.mandatory ? [Validators.required] : [];

      if (field.isMulti) {
        flatField[field.fieldName] = this.fb.array([
          this.fb.control(null, validators),
        ]);
      } else {
        flatField[field.fieldName] = this.fb.control(null, validators);
      }
    });

    return flatField;
  }

  markFormTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormTouched(control);
      }
    });
  }

  onSubmit() {
    this.form.invalid
      ? this.markFormTouched(this.form)
      : console.log(this.form.value);
  }
}
