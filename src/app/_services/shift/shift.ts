export class Shift {
  location: string;
  start: number;
  end: number;
  breakStart: number;
  breakEnd: number;
  note: string;
  onDuty: Array<ShiftPerson>;
  date: Date;
  maxStaff: number;
}

export class ShiftPerson {
  name: string;
  accepted: boolean;
  uid: string;
}
