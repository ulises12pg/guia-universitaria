import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../shared/models/user.model';

@Component({
    selector: 'app-profile-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
    <h2 mat-dialog-title>Editar Perfil</h2>
    <mat-dialog-content>
      <form [formGroup]="profileForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre Completo</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej. Juan Pérez">
          <mat-error *ngIf="profileForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Edad</mat-label>
          <input matInput type="number" formControlName="edad" placeholder="Ej. 18">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Escuela de Procedencia</mat-label>
          <input matInput formControlName="escuela" placeholder="Ej. Prepa 5">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="profileForm.invalid" (click)="onSave()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
  `]
})
export class ProfileDialogComponent {
    profileForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User }
    ) {
        this.profileForm = this.fb.group({
            nombre: [data.user.nombre || '', [Validators.required]],
            edad: [data.user.edad || '', [Validators.min(10), Validators.max(100)]],
            escuela: [data.user.escuela || '']
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.profileForm.valid) {
            this.dialogRef.close(this.profileForm.value);
        }
    }
}
