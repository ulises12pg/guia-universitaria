import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface LegalDialogData {
    title: string;
    content: string;
}

@Component({
    selector: 'app-legal-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <div [innerHTML]="data.content"></div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
    styles: [`
    mat-dialog-content {
      max-height: 60vh;
      overflow-y: auto;
    }
  `]
})
export class LegalModalComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: LegalDialogData) { }
}
