import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  OpenSpace, Reservation, ReservationCreation, ReservationHour, Room, RoomAvailable, SortedTool, Tool, ToolAvailable,
  ToolType
} from '../interface/login';
import {OpenSpaceService} from '../open-space.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit, AfterViewChecked{
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  test = '8:00';
  selectedValue: string;
  openSpaces: OpenSpace[];
  startHours: ReservationHour[] = [];
  endHours: ReservationHour[] = [];
  hourArray = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  startDiv: HTMLElement;
  endDiv: HTMLElement;
  startHour: string;
  endHour: string;
  toggleEnd: boolean;
  toggleStart:boolean;
  openSpace: OpenSpace;
  roomId: string;
  reservationForDate: Reservation[];
  availableRoom: RoomAvailable[];
  availableHour: object;
  availableTool: SortedTool;
  pcNumber  = 0;
  printerNumber = 0;
  foodNumber = 0;
  private data: any;

  constructor(private formBuilder: FormBuilder, public openSpaceService: OpenSpaceService, public router: Router) {}

  public ngAfterViewChecked(): void {
    /* need _canScrollDown because it triggers even if you enter text in the textarea */
    this.startDiv = document.getElementById('start-hour');
    this.endDiv = document.getElementById('end-hour');
  }
  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      open: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.openSpaceService.read().pipe(first())
      .subscribe(
        data => {
          this.openSpaces = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });

  }

  myFilter = (d: Date | null): boolean => {
    // Prevent Saturday and Sunday from being selected.
    return d > new Date();
  }


  orgValueChange(value: any): void{
    if (!this.firstFormGroup.controls.date.value || !this.firstFormGroup.controls.open.value) { return ; }
    this.openSpaceService.getAvailable(new Date(this.firstFormGroup.controls.date.value), this.firstFormGroup.controls.open.value).pipe(first())
      .subscribe(
        data => {
          this.data = data;
          console.log('AVAILABLE');
          console.log(this.firstFormGroup.controls.open.value);
          console.log(this.openSpaces);
          this.reservationForDate = data.reservations;
          this.availableHour = data.availableHour;
          this.openSpace = this.findOpenSpaceById(this.firstFormGroup.controls.open.value);
          if (this.openSpace.rooms[0].id){
              this.roomId = this.openSpace.rooms[0].id; // TODO
            }
          console.log(this.openSpace);
          this.startHour = null;
          this.endHour =  null;
          this.startHours = [];
          this.hourArray.forEach(hour => {
            let isDisabled = false;
            const formatHour = parseInt(hour).toString();
            console.log(data.availableHour[formatHour]);
            if (data.availableHour[formatHour] === this.openSpace.rooms.length){
              isDisabled = true;
            }
            const reservationHour: ReservationHour = {hour, isDisabled};
            this.startHours.push(reservationHour);
          });
          this.startHours.pop();
          console.log(this.startDiv);
          this.toggleStart = true;
          this.toggleEnd = true;
          this.startDiv.style.display = 'inline-block';
          this.endDiv.style.display = 'none';
        },
        error => {
          console.log(error);
        });
  }

  private getNotAvaiblableHour(data): string[] {
    let res: string[];
    console.log(data);
    return res;
  }

  getOpenSpaces(): OpenSpace[] {
    return (this.openSpaces ) ? this.openSpaces : [];
  }
  getStartHours(): object {
    return (this.startHours ) ? this.startHours : [];
  }
  getEndHours(): object {
    return (this.endHours ) ? this.endHours : [];
  }

  getPc(): ToolAvailable[] {
    return (this.openSpace && this.availableTool) ? this.availableTool.laptops : [] ;
  }
  getPrinters(): ToolAvailable[] {
    return (this.openSpace && this.availableTool) ? this.availableTool.printers : [] ;
  }

  getRooms(): RoomAvailable[] {
    return (this.openSpace && this.openSpace.rooms && this.startHour && this.endHour) ? this.availableRoom : [];
  }

  startRes(val: any): void{
    if (this.toggleStart) {
      console.log(val);
      this.disabledHour(val);
      this.startHour = val;
      this.endDiv.style.display = 'inline-block';
      this.getEndVal(val);
    }else{
      this.endHour = null;
      this.availableRoom = [];
      this.startHour = null;
      this.startHours = [];
      this.getStartVal();
      this.endDiv.style.display = 'none';
      this.toggleEnd = true;
    }
    this.toggleStart = !this.toggleStart;
  }

  disabledHour(actual: string): void{
    this.startHours.forEach(hour => {
      if (hour.hour !== actual) {
        const dis = true;
        hour.isDisabled = true;
      }
    });
  }

  endRes(val): void{
    if (this.toggleEnd){
      console.log(val);
      this.endHour = val;
      this.disabledEndHour(val);
      this.availableRoom = this.getAvailableRoom();
      this.availableTool = this.sortTool(this.getAvailableTool());
      console.log(this.availableTool);
      this.roomId = this.firstAvailableRoom().room.id;
    }else{
      this.endHour = null;
      this.getEndVal(this.startHour);
      this.availableRoom = [];
    }
    this.toggleEnd = !this.toggleEnd;
  }

  getEndVal(val){
    let isDisabled = false;
    this.endHours = [];
    const parsedVal = parseInt(val);
    this.hourArray.forEach(hour => {
     if (parsedVal >= parseInt(hour)){
        return;
      }
     const formatHour = parseInt(hour).toString();
     const reservationHour: ReservationHour = {hour, isDisabled};
     if (isDisabled === false && this.availableHour[formatHour] === this.openSpace.rooms.length){
        isDisabled = true;
      }
     this.endHours.push(reservationHour);
    });
    console.log(this.endHours);
  }

  getStartVal(){
    this.hourArray.forEach(hour => {
      let isDisabled = false;
      const formatHour = parseInt(hour).toString();
      console.log(this.data.availableHour[formatHour]);
      if (this.data.availableHour[formatHour] === this.openSpace.rooms.length){
        isDisabled = true;
      }
      const reservationHour: ReservationHour = {hour, isDisabled};
      this.startHours.push(reservationHour);
    });
    this.startHours.pop();
  }

  disabledEndHour(actual: string): void{
    this.endHours.forEach(hour => {
      const dis = true;
      if (hour.hour !== actual) {
        hour.isDisabled = true;
      }
    });
  }

  findOpenSpaceById(id: string): OpenSpace{
    let res;
    this.openSpaces.forEach(openSpace => {
      if (openSpace.id === id){
        res = openSpace;
      }
    });
    return res;
  }

  reserve(): void {
      const start: Date = new Date(this.firstFormGroup.controls.date.value);
      start.setHours(parseInt(this.startHour));
      const end: Date = new Date(this.firstFormGroup.controls.date.value);
      end.setHours(parseInt(this.endHour));
      console.log(start);
      console.log(end);
      const reserved: string[] =  this.pickSomeToolToReserve(this.pcNumber, this.printerNumber) ;
      const reservation: ReservationCreation = {
        start,
        end,
        food: this.foodNumber,
        room: this.roomId,
        tools: reserved
      };
      this.openSpaceService.reserve(reservation).pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate(['/']);
          },
          error => {
            console.log(error);
          });
  }

  isDateOverLapping(startDate1, endDate1, startDate2, endDate2){
    return (startDate1 <= endDate2) && (endDate1 >= startDate2);
  }

  private getAvailableRoom(): RoomAvailable[]  {
    const res: RoomAvailable[] = [];
    this.openSpace.rooms.forEach(room =>
    {
      const roomAvailable: RoomAvailable = {room, available: this.isRoomAvailable(room.id)};
      res.push(roomAvailable);
    });
    console.log(res);
    return res;
  }

  isRoomAvailable(roomId: string): boolean{
    const start: Date = new Date(this.firstFormGroup.controls.date.value);
    start.setHours(parseInt(this.startHour));
    start.setMinutes(1);
    const end: Date = new Date(this.firstFormGroup.controls.date.value);
    end.setHours(parseInt(this.endHour));

    for (let i = 0; i < this.reservationForDate.length; i++){
        const reservation: Reservation = this.reservationForDate[i];
        if (reservation.room.id === roomId){

          if (this.isDateOverLapping(new Date(reservation.start), new Date(reservation.end), start, end)){
            console.log("OVERLAPP");
            console.log(new Date(reservation.start));
            console.log(new Date(reservation.end));
            console.log(start);
            console.log(end);
            return false;
          }
        }
    }
    return true;
  }

  private getAvailableTool(): ToolAvailable[]  {
    const res: ToolAvailable[] = [];
    this.openSpace.tools.forEach(tool =>
    {
      if (this.isToolAvailable(tool.id)){
        const toolAvailable: ToolAvailable = {tool, available: true };
        res.push(toolAvailable);
      }
    });
    console.log(res);
    return res;
  }

  isToolAvailable(toolId: string): boolean{
    const start: Date = new Date(this.firstFormGroup.controls.date.value);
    start.setHours(parseInt(this.startHour));
    start.setMinutes(1);
    const end: Date = new Date(this.firstFormGroup.controls.date.value);
    end.setHours(parseInt(this.endHour));


    for (let i = 0; i < this.reservationForDate.length; i++) {
      const reservation: Reservation = this.reservationForDate[i];
      console.log(reservation);
      for (let j = 0; j < reservation.tools.length; j++){
        if (reservation.tools[j].id === toolId) {
          console.log(new Date(reservation.start));
          console.log(new Date(reservation.end));
          console.log(start);
          console.log(end);
          if (this.isDateOverLapping(new Date(reservation.start), new Date(reservation.end), start, end)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private firstAvailableRoom(): RoomAvailable {
    let res: RoomAvailable = null;
    this.availableRoom.forEach(room => {
      if (room.available && res === null){
        res =  room;
      }
    });
    return res;
  }

  sortTool(tools: ToolAvailable[]): SortedTool{
    const res: SortedTool = {laptops: [], printers: [], others: []};
    tools.forEach(tool => {
      if (tool.tool.type === ToolType.LAPTOP){
        res.laptops.push(tool);
      }else if (tool.tool.type === ToolType.PRINTER){
        res.printers.push(tool);
      }else{
        res.others.push(tool);
      }
    });
    return res;
  }

  pickSomeToolToReserve(pcNumber: number, printerNumber: number): string[] {
    const res = [];
    let pcRetrieve = 0;
    let printerRetrieve = 0;
    for (let i = 0; i < this.availableTool.laptops.length; i++) {
      if (pcRetrieve === pcNumber){
        break;
      }
      const tool = this.availableTool.laptops[i];
      if (tool.available) {
        res.push(tool.tool.id);
        pcRetrieve += 1;
      }

    }
    for (let i = 0; i < this.availableTool.printers.length; i++) {
      if (printerRetrieve === printerNumber){
        break;
      }
      const tool = this.availableTool.printers[i];
      if (tool.available) {
        res.push(tool.tool.id);
        printerRetrieve += 1;
      }
    }
    return res;

  }
}
