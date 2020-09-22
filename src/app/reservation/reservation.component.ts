import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OpenSpace, ReservationCreation, ReservationHour} from '../interface/login';
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
  openSpace: OpenSpace;
  roomId: string;

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

  orgValueChange(value: any): void{
    if (!this.firstFormGroup.controls.date.value || !this.firstFormGroup.controls.open.value) { return ; }
    this.openSpaceService.getAvailable(new Date(this.firstFormGroup.controls.date.value), this.firstFormGroup.controls.open.value).pipe(first())
      .subscribe(
        data => {
          console.log('AVAILABLE');
          console.log(data);
          console.log(this.firstFormGroup.controls.open.value);
          console.log(this.openSpaces);
          this.openSpace = this.findOpenSpaceById(this.firstFormGroup.controls.open.value);
          if (this.openSpace.rooms[0].id){
              this.roomId = this.openSpace.rooms[0].id;
            }
          console.log(this.openSpace);
          this.startHour = null;
          this.endHour =  null;
          this.startHours = [];
          const notAvaiableHour: string[] = this.getNotAvaiblableHour(data);
          this.hourArray.forEach(hour => {
            const reservationHour: ReservationHour = {hour, isDisabled: false};
            this.startHours.push(reservationHour);
          });
          console.log(this.startDiv);
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

  getTools(): object {
    return (this.openSpace && this.openSpace.tools) ? this.openSpace.tools : [];
  }

  getRooms(): object {
    return (this.openSpace && this.openSpace.rooms) ? this.openSpace.rooms : [];
  }

  startRes(val: any): void{
      console.log(val);
      this.disabledHour(val);
      this.startHour = val;
      this.endDiv.style.display = 'inline-block';
      this.getEndVal(val);
  }

  disabledHour(actual: string): void{
    this.startHours.forEach(hour => {
      const dis = true;
      hour.isDisabled = true;
    });
  }

  endRes(val): void{
    if (this.toggleEnd){
      console.log(val);
      this.endHour = val;
      this.disabledEndHour(val);
    }else{
      this.endHour = null;
      this.getEndVal(this.startHour);
    }
    this.toggleEnd = !this.toggleEnd;
  }

  getEndVal(val){
    this.endHours = [];
    const parsedVal = parseInt(val);
    this.startHours.forEach(hour => {
     if (parsedVal >= parseInt(hour.hour)){
        return;
      }
     const reservationHour: ReservationHour = {hour: hour.hour, isDisabled: false};
     this.endHours.push(reservationHour);
    });
    console.log(this.endHours);
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
      start.setUTCHours(parseInt(this.startHour));
      const end: Date = new Date(this.firstFormGroup.controls.date.value);
      end.setUTCHours(parseInt(this.endHour));
      console.log(start);
      console.log(end);
      const reservation: ReservationCreation = {
        start,
        end,
        food: 0,
        room: this.roomId,
        tools: []
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
}
