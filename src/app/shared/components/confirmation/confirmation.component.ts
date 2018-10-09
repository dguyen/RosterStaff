import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  template: `
    <h2 mat-dialog-title>Are you sure?</h2>
    <div mat-dialog-content *ngIf="message">
      <p>{{ message }}</p>
    </div>
    <div>
      <mat-dialog-actions style="float:right">
        <button mat-button color="accent" mat-dialog-close>No</button>
        <button mat-button color="accent" [mat-dialog-close]='true'>Yes</button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmationComponent {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && Object.keys(data).includes('message')) {
      this.message = data.message;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
