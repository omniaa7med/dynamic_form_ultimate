import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { Field } from '../../interfaces/fieldType';

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  templateUrl: './dynamic-group.component.html',
  styles: '',
})
export class DynamicGroupComponent {
  @Input() groupName!: string;
  @Input() fields: Field[] = [];
  @Input() parentForm!: FormGroup | any;

  // Get groupArray as a FormArray
  get groupArray(): FormArray {
    return this.parentForm.get(this.groupName) as FormArray;
  }

  // Get nested groups, which group fields based on their 'Group' property
  get nestedGroups() {
    const nested: Record<string, Field[]>[] = [];

    if (
      Array.isArray(this.groupArray.controls) &&
      this.groupArray.controls.length > 0
    ) {
      this.groupArray.controls.forEach(() => {
        const nestedPerGroup: Record<string, Field[]> = {};

        nested.push(nestedPerGroup);
      });
    }
    return nested;
  }

  // Add a new group
  createGroup() {
    const newGroup = new FormGroup({});

    this.fields.forEach((field: Field) => {
      const control = new FormControl(
        field.type === 'string' ? '' : null,
        field.mandatory ? Validators.required : []
      );
      newGroup.addControl(field.fieldName, control);
    });

    (this.parentForm.get(this.groupName) as FormArray).push(newGroup);
  }

  // Remove a group from FormArray
  removeGroup(index: number) {
    this.groupArray.removeAt(index);
  }
}
