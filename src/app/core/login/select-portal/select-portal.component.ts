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

  <h2 mat-dialog-title>Select Portal</h2>
  <mat-dialog-content>
    <mat-nav-list>
      <a mat-list-item *ngFor="let portal of portals" (click)="dialogRef.close(portal)">
        {{ portal }}
      </a>
    </mat-nav-list>
  </mat-dialog-content>

  <mat-dialog-actions style="float:right">
    <button mat-button mat-dialog-close>Cancel</button>
  </mat-dialog-actions>
  `,
})
export class SelectPortalComponent implements OnInit {
  portals: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<SelectPortalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.portals = data.portals.map(x => this.capitalizeFirstLetter(x));
  }

  ngOnInit() {
  }

  capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
