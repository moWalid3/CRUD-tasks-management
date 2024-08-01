import { Component, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss'
})
export class ControlComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  validations = input<{errorCode: string, msg: string}[]>();
}
