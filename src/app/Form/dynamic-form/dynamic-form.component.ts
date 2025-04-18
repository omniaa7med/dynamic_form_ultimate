import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  form!: FormGroup;
  schema: any;
  groupedFields: Record<string, any[]> = {};
  flatFields: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('assets/data/tabletest1.json').subscribe((data) => {
      this.schema = data;
      this.buildSchema(this.schema.fieldName);
      this.form = this.fb.group({
        ID: [''],
        // inputter: ['omnia'],
        ...this.handleFlatFields(),
        ...this.initGroups(),
      });
      console.log(this.form);
    });
  }

  buildSchema(fields: any[]) {
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

  initGroups(): any {
    const groups: { [key: string]: FormArray } = {};

    Object.keys(this.groupedFields).forEach((groupKey: any) => {
      const fieldGroup = this.groupedFields[groupKey];

      // Build a form group for one item
      const createGroup = (): FormGroup => {
        const fg: { [key: string]: FormControl } = {};
        fieldGroup.forEach((field) => {
          fg[field.fieldName] = this.fb.control('');
        });
        return this.fb.group(fg);
      };

      // Initialize the group with one formGroup
      groups[groupKey] = this.fb.array([createGroup()]);
    });

    return groups;
  }

  handleFlatFields() {
    const group: { [key: string]: any } = {};
    this.flatFields.forEach((field) => {
      const isMulti = field.isMulti === true;
      if (isMulti) {
        group[field.fieldName] = this.fb.array([this.fb.control('')]);
      } else {
        group[field.fieldName] = this.fb.control('');
      }
    });
    return group;
  }

  onSubmit() {
    console.log('Form Output:', this.form.value);
  }
}
