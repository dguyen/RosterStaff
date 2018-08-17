import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit {
  avaliableShifts: any[] = [
    {Location: 'Mount Waverley', Date: '26/03/16', Start: 1400, End: 1600, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Glen Waverley', Date: '22/03/16', Start: 1600, End: 2200, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Ashwood', Date: '26/04/16', Start: 1500, End: 2000, Duration: 500, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Clayton', Date: '21/06/16', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Clayton', Date: '21/06/16', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Slamtown Downtown', Date: '28/06/15', Start: 2000, End: 2200, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'y'}
  ];

  currentShifts: any[] = [
    {Location: 'Clayton', Date: '21/06/16', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Ashwood', Date: '26/04/16', Start: 1500, End: 2000, Duration: 500, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'}
  ];

  shiftHistory: any[] = [
    {Location: 'Mount Waverley', Date: '26/03/16', Start: 1400, End: 1600, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Glen Waverley', Date: '22/03/16', Start: 1600, End: 2200, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Ashwood', Date: '26/04/16', Start: 1500, End: 2000, Duration: 500, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Clayton', Date: '21/06/16', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Clayton', Date: '21/06/16', Start: 1400, End: 2000, Duration: 600, Note: 'n/a', Replacement: 'n/a', On_Duty: 'yeet'},
    {Location: 'Slamtown Downtown', Date: '28/06/15', Start: 2000, End: 2200, Duration: 200, Note: 'n/a', Replacement: 'n/a', On_Duty: 'y'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
