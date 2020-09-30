export interface ILogin {
  token: string;
}

export class User {
  id: string;
  username: string;
  token: any;
}



export class OpenSpace {
  id: string;
  description: string;
  name: string;
  rooms: Room[];
  tools: Tool[];
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
