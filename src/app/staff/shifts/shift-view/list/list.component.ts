import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Shift } from '../../../../_services/shift/shift';
import { ShiftService } from '../../../../_services/shift/shift.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() shiftData: Shift[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay: string[] = [];
  dataSource: MatTableDataSource<any>;

  constructor(public shiftService: ShiftService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.shiftData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    console.log('Data source changed');
    if (this.shiftData) {
      this.refreshTable();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.shiftData);
    // if (this.shiftData.length > 0) {
    //   this.columnsToDisplay = Object.keys(this.shiftData[0]);
    // }
    // TODO: Remove hardcode
    this.columnsToDisplay = ['location', 'date', 'start', 'end', 'breakStart', 'breakEnd', 'note', 'onDuty'];
  }

  getColumns() {
    if (this.shiftData.length > 0) {
      this.columnsToDisplay = Object.keys(this.shiftData[0]);
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
}
