import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort } from '@angular/material';

// Mockup Data
const mockupData = [
  { name: 'Some Name', contacts: '0412345678'},
  { name: 'Test Name', contacts: '0412345678'},
  { name: 'Fake Name', contacts: '0412345678'},
  { name: 'True Name', contacts: '0412345678'},
  { name: 'Fool Name', contacts: '0412345678'},
];

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss']
})
export class AddShiftComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'name', 'contacts'];
  dataSource = new MatTableDataSource<any>(mockupData);
  selection = new SelectionModel<any>(true, []);

  // Mockup Data
  locations = [
    {
      'description': 'Glen Waverley'
    },
    {
      'description': 'Mount Waverley'
    },
  ];
  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
