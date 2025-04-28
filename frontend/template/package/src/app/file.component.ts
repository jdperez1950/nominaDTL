import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'formly-field-file',
  template: `
    <mat-form-field appearance="outline" class="file-field">
      <mat-label>{{ to.placeholder }}</mat-label>
      <input
        type="text"
        matInput
        [value]="displayValue"
        readonly
      />

      <input
        type="file"
        #fileInput
        [formlyAttributes]="field"
        (change)="onChange($event)"
        [accept]="to['accept']"
        [multiple]="to['multiple']"
        hidden
      />

      <button
        mat-button
        matSuffix
        type="button"
        (click)="fileInput.click()"
      >
        Seleccionar archivo
      </button>
    </mat-form-field>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormlyModule,
    MatButtonModule,
  ],
  styles: [`
    .file-field {
      width: 100%;
      margin: 10px 0;
      border-radius: 5px;
    }
  `]
})
export class FileComponent extends FieldType {
  /**
   * Devuelve la cadena que se mostrará en el input de sólo lectura.
   * - Si el valor es null o undefined: 'Ningún archivo seleccionado'.
   * - Si es un string, retornamos esa cadena (por ej. una URL).
   * - Si multiple=false y es un File, retornamos el nombre del archivo.
   * - Si multiple=true y es un File[], retornamos los nombres separados por coma.
   */
  get displayValue(): string {
    const val = this.formControl.value;
    if (!val) {
      return 'Ningún archivo seleccionado';
    }

    // Si multiple = false y val es un File
    if (!Array.isArray(val) && val?.name) {
      return val.name;
    }

    // Si es un string (ej. una URL)
    if (typeof val === 'string') {
      return val;
    }

    // Si multiple = true, val será un File[]
    if (Array.isArray(val) && val.length > 0) {
      const fileNames = val.map(file => file.name).join(', ');
      return fileNames;
    }

    return 'Ningún archivo seleccionado';
  }

  /**
   * Evento change del input file.
   * - Si la propiedad 'multiple' es verdadera, guarda todos los archivos en un array.
   * - De lo contrario, guarda solo el primer archivo.
   */
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.to['multiple']) {
      // Modo múltiple
      const files = input.files ? Array.from(input.files) : [];
      this.formControl.setValue(files);
    } else {
      // Modo simple
      const file = input.files?.[0];
      if (file) {
        this.formControl.setValue(file);
      }
    }
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
  }
}
