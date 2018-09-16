import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  template: `
    <h2 mat-dialog-title>Are you sure?</h2>
    <div>
      <mat-dialog-actions style="float:right">
        <button mat-button color="accent" mat-dialog-close>No</button>
        <button mat-button color="accent" [mat-dialog-close]='true'>Yes</button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
