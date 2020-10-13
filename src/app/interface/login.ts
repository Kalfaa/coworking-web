
export interface ILogin {
  token: string;
}

export class User {
  id: string;
  username: string;
  token: any;
  user: any;
}

export class HourRange{
  constructor(public start: any = '9:00', public end: any= '21:00') {}

  static convertHourRangeToString(hourRange: HourRange): HourRange{
    const res = new HourRange();
    res.start = hourRange.start.toString() + ':00';
    res.end = hourRange.end.toString() + ':00';
    return res;
  }

  convertHourRangeToInt(): HourRange{
    const res = new HourRange();
    res.start = parseInt(this.start);
    res.end = parseInt(this.end);
    return res;
  }

}

export class OpenHours{
  monday: HourRange = new HourRange();
  tuesday: HourRange = new HourRange();
  wednesday: HourRange = new HourRange();
  thursday: HourRange = new HourRange();
  friday: HourRange = new HourRange();
  saturday: HourRange = new HourRange();
  sunday: HourRange = new HourRange();

  static convertHourRangeToString(openHours: OpenHours): OpenHours {
    const res = new OpenHours();
    res.monday = HourRange.convertHourRangeToString(openHours.monday);
    res.tuesday = HourRange.convertHourRangeToString(openHours.tuesday);
    res.wednesday = HourRange.convertHourRangeToString(openHours.wednesday);
    res.thursday = HourRange.convertHourRangeToString(openHours.thursday);
    res.friday = HourRange.convertHourRangeToString(openHours.friday);
    res.saturday = HourRange.convertHourRangeToString(openHours.saturday);
    res.sunday = HourRange.convertHourRangeToString(openHours.sunday);
    return res;
  }


  convertHourRangeToInt(): OpenHours{
    const res = new OpenHours();
    res.monday = this.monday.convertHourRangeToInt();
    res.tuesday = this.tuesday.convertHourRangeToInt();
    res.wednesday = this.wednesday.convertHourRangeToInt();
    res.thursday = this.thursday.convertHourRangeToInt();
    res.friday = this.friday.convertHourRangeToInt();
    res.saturday = this.saturday.convertHourRangeToInt();
    res.sunday = this.sunday.convertHourRangeToInt();
    return res;
  }
}

export class OpenSpace {
  id: string;
  description: string;
  name: string;
  rooms: Room[];
  tools: Tool[];
  openHours: OpenHours;
}




export class OpenSpaceId {
  id: string;
}

export class Room {
  id: string;
  name: string;
  description: string;
  openSpace: OpenSpaceId;
}

export enum ToolType {
  TOOL = 'TOOL',
  PRINTER = 'PRINTER',
  LAPTOP = 'LAPTOP'
}


export class Tool {
  id: string;
  name: string;
  type: ToolType;
}

export class SortedTool{
  laptops: ToolAvailable[];
  printers: ToolAvailable[];
  others: ToolAvailable[];
}


export class SortedToolBasic{
  laptops: Tool[];
  printers: Tool[];
  others: Tool[];
}

export class ReservationHour {
  hour: string;
  isDisabled: boolean;
}



export class ReservationCreation {
  start: Date;
  end: Date;
  food: number;
  room: string;
  tools: string[];
}

export class Reservation {
  id: string;
  start: Date;
  end: Date;
  food: number;
  room: Room;
  user: object;
  tools: Tool[];
}

export class Available {
  reservation: RoomAvailable[];
  availableHour: object;
}


export class RoomAvailable{
  room: Room;
  available;
}

export class ToolAvailable{
  tool: Tool;
  available;
}


export enum SubscriptionType {
  SIMPLE = 'SIMPLE',
  RESIDENT = 'RESIDENT',
  NONE= 'NONE'
}


export class Subscription{
  type: SubscriptionType;
  end: Date;
}

export class UserProfile {
  id: string;
  username: string;
  created: Date;
  isAdmin: boolean;
  subscription: Subscription;
}
