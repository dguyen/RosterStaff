import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Shift } from '../../../../_services/shift/shift';
import { ShiftService } from '../../../../_services/shift/shift.service';
import { ConfirmationComponent } from '../../../../shared/components/confirmation/confirmation.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() shiftStream: Subject<Shift[]>;
  @Input() allowAccept: Boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay: string[] = [];
  dynamicColumns: string[] = [];
  dataSource = new MatTableDataSource<Shift>();
  selection = new SelectionModel<Shift>(true, []);

  constructor(public shiftService: ShiftService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadColumns();

    this.shiftStream.subscribe((data: Shift[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  loadColumns() {
    // if (this.shiftData.length > 0) {
    //   this.columnsToDisplay = Object.keys(this.shiftData[0]);
    // }
    // TODO: Remove hardcode

    this.dynamicColumns = ['location', 'date', 'start', 'end', 'breakStart', 'breakEnd', 'note', 'onDuty'];

    if (this.allowAccept) {
      this.columnsToDisplay = ['select'].concat( this.dynamicColumns);
    } else {
      this.columnsToDisplay = this.dynamicColumns;
    }
  }

  getColumnName(name: string) {
    const colName = {
      location: 'Location',
      start: 'Start',
      end: 'End',
      breakStart: 'Break start',
      breakEnd: 'Break end',
      note: 'Note',
      onDuty: 'On duty',
      date: 'Date'
    };
    return colName[name] ? colName[name] : name;
  }

  updateShift(decision: boolean) {
    const selection = this.selection.selected;

    if (selection.length > 0) {
      this.dialog.open(ConfirmationComponent, {
        width: '15em',
      }).afterClosed().subscribe((result) => {
        if (result) {
          selection.forEach(element => {
            decision ?
              this.shiftService.acceptShift(element) :
              this.shiftService.declineShift(element);
              this.removeElement(element);
          });
          this.selection.clear();
        }
      });
    } else {
      this.snackBar.open('No shifts selected', null, { duration: 2000 });
    }
  }

  removeElement(shift: Shift) {
    const tmpData = this.dataSource.data;
    const index = tmpData.indexOf(shift);
    if (index > -1) {
      tmpData.splice(index, 1);
      this.dataSource.data = tmpData;
    }
  }
}
