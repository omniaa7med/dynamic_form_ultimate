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

interface Field {
  fieldName: string;
  type: string;
  isMulti?: boolean;
  mandatory?: boolean;
  noChange?: boolean;
  Group: string;
}

@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  templateUrl: './dynamic-group.component.html',
  styleUrls: ['./dynamic-group.component.scss'],
})
export class DynamicGroupComponent {
  @Input() groupName!: string;
  @Input() fields: Field[] = [];
  @Input() parentForm!: FormGroup | any;

  // Get groupArray as a FormArray
  get groupArray(): FormArray {
    return this.parentForm.get(this.groupName) as FormArray;
  }

  get innerFields(): Field[] {
    return this.fields;
  }

  // Get nested groups, which group fields based on their 'Group' property
  get nestedGroups(): Record<string, Field[]>[] {
    const nested: Record<string, Field[]>[] = [];

    // Make sure groupArray.controls is an array and contains elements
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
  addGroup() {
    const newGroup = new FormGroup({});

    this.fields.forEach((field: Field) => {
      const control = new FormControl(
        field.type === 'string' ? '' : null,
        field.mandatory ? Validators.required : []
      );
      newGroup.addControl(field.fieldName, control);
    });

    const nestedGroups: Record<string, Field[]> = {};

    // Create FormGroup for each subgroup (nested fields)
    for (const [subGroupName, fields] of Object.entries(nestedGroups)) {
      const subGroup = new FormGroup({});
      fields.forEach((field) => {
        const control = new FormControl(
          field.type === 'string' ? '' : null,
          field.mandatory ? Validators.required : []
        );
        subGroup.addControl(field.fieldName, control);
      });

      // Add the subGroup to the parent FormGroup
      newGroup.addControl(subGroupName, subGroup);
    }

    // Add the new group to the FormArray
    (this.parentForm.get(this.groupName) as FormArray).push(newGroup);
  }

  // Remove a group from the FormArray
  removeGroup(index: number) {
    this.groupArray.removeAt(index);
  }
}
