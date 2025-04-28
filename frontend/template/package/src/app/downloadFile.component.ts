import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-download-file-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    NgForOf
  ],
  template: `
    <h1 mat-dialog-title>Selecciona uno o varios archivos</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label>Archivos</mat-label>
        <mat-select [(value)]="selectedFiles" multiple>
          <mat-option *ngFor="let file of files" [value]="file">
            {{ file }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" (click)="onDownload()">Descargar</button>
    </div>
  `
})
export class DownloadFileComponent implements OnInit {
  files: string[] = [];
  selectedFiles: string[] = []; // Ahora es un array

  constructor(
    public dialogRef: MatDialogRef<DownloadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.files) {
      this.files = this.data.files;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDownload(): void {
    // Retornamos el array de archivos seleccionados
    this.dialogRef.close(this.selectedFiles);
  }
}
