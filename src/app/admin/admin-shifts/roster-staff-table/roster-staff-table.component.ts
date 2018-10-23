import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort } from '@angular/material';
import { StaffService, Staff } from '../../../_services/staff/staff.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roster-staff-table',
  templateUrl: './roster-staff-table.component.html',
  styleUrls: ['./roster-staff-table.component.scss']
})
export class RosterStaffTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() staffUIDArray: String[];
  @Input() editTable: boolean;
  displayedColumns: string[] = ['name', 'emailContact', 'phoneContact'];
  dataSource = new MatTableDataSource<Staff>();
  selection = new SelectionModel<any>(true, []);
  toUnsubscribe: Subscription;
  isLoading = true;

  constructor(private staffService: StaffService) { }

  ngOnInit() {
    this.initializeRosterTable();
  }

  ngOnDestroy() {
    this.toUnsubscribe.unsubscribe();
  }

  enableSelection() {
    this.displayedColumns.splice(0, 0, 'select');
  }

  initializeRosterTable() {
    if (this.editTable) {
      this.enableSelection();
    }
    this.toUnsubscribe = this.staffService.staffStream.subscribe((staffArray: Staff[]) => {
      if (!staffArray) { return; }
      this.isLoading = false;
      this.selection.clear();
      if (this.editTable) {
        // Show all staff with rostered staff ticked
        this.dataSource.data = staffArray;
        this.dataSource.data.forEach(staffMember => {
          if (this.staffUIDArray && this.staffUIDArray.includes(staffMember.uid)) {
            this.selection.select(staffMember);
          }
        });
      } else {
        // Else type is 'view' therefore only show rostered members
        this.dataSource.data = staffArray.filter((x) => this.staffUIDArray.includes(x.uid));
      }
    });
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Returns the UID of all rostered staff members in an array
   */
  getSelectedStaff() {
    const onDuty = {};
    this.selection.selected.forEach(element => {
      onDuty[element.uid] = {
        name: element.firstName
      };
    });
    return onDuty;
  }
}
