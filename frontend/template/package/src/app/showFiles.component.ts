import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-show-files-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <h1 mat-dialog-title>{{ data.title || 'Archivos disponibles' }}</h1>

    <div mat-dialog-content>
      <!-- Caso para lista de archivos -->
      <div *ngIf="!isImageMode">
        <mat-list>
          <mat-list-item *ngFor="let file of files">
            <mat-icon matListItemIcon>insert_drive_file</mat-icon>
            <span matListItemTitle>{{ file }}</span>
          </mat-list-item>
        </mat-list>
      </div>
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cerrar</button>
    </div>
  `,
  styles: [`
    .image-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }
    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class ShowFilesListComponent implements OnInit {
  files: string[] = [];
  isImageMode: boolean = false;
  imageSrc: string = '';

  constructor(
    public dialogRef: MatDialogRef<ShowFilesListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data && this.data.files) {
      // Si es un array con un solo elemento que parece imagen base64
      if (this.data.files.length === 1 && this.isBase64Image(this.data.files[0])) {
        this.isImageMode = true;
        this.imageSrc = this.getImageSrc(this.data.files[0]);
      } else {
        // Modo normal de lista de archivos
        this.files = this.data.files;
        this.isImageMode = false;
      }
    }
  }

  private isBase64Image(str: string): boolean {
    // Detectar si es base64 de imagen (con o sin prefijo data:image)
    return /^data:image\/(png|jpeg|jpg|gif);base64,/.test(str) ||
      (/^[A-Za-z0-9+/]+={0,2}$/.test(str) && str.length > 100);
  }

  private getImageSrc(base64: string): string {
    // Si ya tiene el prefijo data:image, usarlo directamente
    if (base64.startsWith('data:image')) {
      return base64;
    }
    // Si no, asumir que es PNG (puedes ajustar según necesites)
    return `data:image/png;base64,${base64}`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
