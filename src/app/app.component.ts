import { Component } from '@angular/core';
import { DynamicFormComponent } from './Form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dynamic_form_ultimate';
}
