import { Component, OnInit } from '@angular/core';

const Job_list: AvailableJobs[] = [
  {Location: 'Mount Waverley', Start: 1400, End: 1600, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
  {Location: 'Glen Waverley', Start: 1600, End: 2200, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
  {Location: 'Ashwood', Start: 1500, End: 2000, Duration: 500, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
  {Location: 'Clayton', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
  {Location: 'Slamtown Downtown', Start: 2000, End: 2200, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},


];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['Location', 'Start', 'End', 'Duration', 'Note', 'Replacement', 'On_Duty'];
  columnsToDisplay: string[] = this.displayedColumns;
  dataSource = Job_list;
  constructor() { }

  ngOnInit() {
  }

}

