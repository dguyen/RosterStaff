import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-organisation',
  template: `
  <!-- <mat-spinner
  mode="indeterminate"
  diameter=20
  color="accent"
  *ngIf="showLoading"
  style="float: right;">
  </mat-spinner> -->

  <h2 mat-dialog-title>Select Organisation</h2>
  <mat-dialog-content>
    <mat-nav-list>
      <a mat-list-item *ngFor="let item of organisations" (click)="dialogRef.close(item)">
        {{ item }}
      </a>
    </mat-nav-list>
  </mat-dialog-content>

  <mat-dialog-actions style="float:right">
    <button mat-button mat-dialog-close>Cancel</button>
  </mat-dialog-actions>
  `,
})
export class SelectOrganisationComponent implements OnInit {
  organisations: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<SelectOrganisationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.organisations = data.organisations;
  }

  ngOnInit() {
  }
}
