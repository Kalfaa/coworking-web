import { Component, OnInit } from '@angular/core';
import {OpenSpaceService} from '../open-space.service';
import {first} from 'rxjs/internal/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {OpenSpace, Reservation, SortedTool, SortedToolBasic, Tool, ToolAvailable, ToolType} from '../interface/login';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['select', 'OpenSpace', 'name', 'description', 'hour'];
  selection = new SelectionModel<Reservation>(false, []);
  toggle = false;
  reservation: Reservation;
  weekday = ['Lundi', ' Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  month = ['Janvier', ' Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  reservationForDate;
  availableTool: SortedTool;
  openSpace: OpenSpace;
  sortedTool: SortedToolBasic = {laptops: [], printers: [], others: []};
  printersToAdd = 0;
  laptopsToAdd = 0;
  foodToAdd = 0;
  disabled = false;
  constructor(private openSpaceService: OpenSpaceService) {

  }

  ngOnInit(): void {
    this.openSpaceService.readReservation()
      .pipe(first())
      .subscribe(
        data => {
          // this.reservationForDate = data.reservations;
          this.dataSource = data;
          this.availableTool = this.sortTool(this.getAvailableTool());
          // console.log(this.dataSource[0].room.openSpace.name);
        },
        error => {
          console.log(error);
        });
  }

  addPrinter(): void {
    if (this.printersToAdd >= this.availableTool.printers.length) {
      return;
    }
    this.printersToAdd += 1;
  }

  removePrinter(): void {
    if (this.printersToAdd + this.sortedTool.printers.length === 0) {
      return;
    }
    this.printersToAdd -= 1;
  }

  addLaptops(): void {

    if (this.laptopsToAdd >= this.availableTool.laptops.length) {
      return;
    }
    this.laptopsToAdd += 1;
  }

  addFood(): void {
    if (this.foodToAdd + this.reservation.food >= 20) {
      return;
    }
    this.foodToAdd += 1;
  }

  removeFood(): void {
    if (this.foodToAdd + this.reservation.food === 0) {
      return;
    }
    this.foodToAdd -= 1;
  }


  removeLaptops(): void {
    if (this.laptopsToAdd + this.sortedTool.laptops.length === 0) {
      return;
    }
    this.laptopsToAdd -= 1;
  }

  checkboxLabel(row?: Reservation): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  selectRow(row) {
    console.log(row);
    this.selection.toggle(row);
    const description = document.getElementById('description');
    if (this.selection.selected[0]) {
      this.reservation = this.selection.selected[0];

      description.style.display = 'inline-block';
      this.getDetailReservation();
    } else {
      description.style.display = 'none';
    }
  }


  sortTool(tools: ToolAvailable[]): SortedTool {
    const res: SortedTool = {laptops: [], printers: [], others: []};
    tools.forEach(tool => {
      if (tool.tool.type === ToolType.LAPTOP) {
        res.laptops.push(tool);
      } else if (tool.tool.type === ToolType.PRINTER) {
        res.printers.push(tool);
      } else {
        res.others.push(tool);
      }
    });
    return res;
  }


  sortToolBasic(tools: Tool[]): SortedToolBasic {
    const res: SortedToolBasic = {laptops: [], printers: [], others: []};
    tools.forEach(tool => {
      if (tool.type === ToolType.LAPTOP) {
        res.laptops.push(tool);
      } else if (tool.type === ToolType.PRINTER) {
        res.printers.push(tool);
      } else {
        res.others.push(tool);
      }
    });
    return res;
  }

  isToolAvailable(toolId: string): boolean {
    const start: Date = new Date(this.reservation.start);
    const end: Date = new Date(this.reservation.end);
    console.log('ee');
    console.log(this.reservationForDate);
    for (let i = 0; i < this.reservationForDate.length; i++) {
      const reservation: Reservation = this.reservationForDate[i];
      console.log(reservation);
      for (let j = 0; j < reservation.tools.length; j++) {
        if (reservation.tools[j].id === toolId) {
          if (this.isDateOverLapping(new Date(reservation.start), new Date(reservation.end), start, end)) {
            console.log('OVERLAPING');
            return false;
          }
        }
      }
    }
    return true;
  }

  pickSomeToolToReserve(pcNumber: number, printerNumber: number): string[] {
    const res = [];
    let pcRetrieve = 0;
    let printerRetrieve = 0;
    if ( pcNumber > 0) {
      for (let i = 0; i < this.availableTool.laptops.length; i++) {
        if (pcRetrieve === pcNumber) {
          break;
        }
        const tool = this.availableTool.laptops[i];
        if (tool.available) {
          res.push(tool.tool.id);
          pcRetrieve += 1;
        }

      }
    }
    if ( printerNumber > 0) {

      for (let i = 0; i < this.availableTool.printers.length; i++) {
        if (printerRetrieve === printerNumber) {
          break;
        }
        const tool = this.availableTool.printers[i];
        if (tool.available) {
          res.push(tool.tool.id);
          printerRetrieve += 1;
        }
      }
    }
    return res;

  }

  private getAvailableTool(): ToolAvailable[] {
    const res: ToolAvailable[] = [];
    this.openSpace.tools.forEach(tool => {
      if (this.isToolAvailable(tool.id)) {
        const toolAvailable: ToolAvailable = {tool, available: true};
        res.push(toolAvailable);
      }
    });
    console.log(res);
    return res;
  }

  isDateOverLapping(startDate1, endDate1, startDate2, endDate2) {
    return (startDate1 <= endDate2) && (endDate1 >= startDate2);
  }

 async  modify() {
    console.log(this.foodToAdd);
    if (this.laptopsToAdd > 0 || this.printersToAdd > 0) {
      const newTool = this.pickSomeToolToReserve(this.laptopsToAdd, this.printersToAdd);
      await this.openSpaceService.addToolsToReservation(this.reservation.id, newTool).toPromise();
    }
    if (this.laptopsToAdd < 0 || this.printersToAdd < 0) {
      const removeTool = this.pickSomeToolToRemove(this.laptopsToAdd, this.printersToAdd);
      await this.openSpaceService.removeToolsToReservation(this.reservation.id, removeTool).toPromise();
    }

    if (this.foodToAdd !== 0){
     await this.openSpaceService.changeFood(this.reservation.id, this.reservation.food + this.foodToAdd).toPromise();
   }

    await this.openSpaceService.a(this.reservation.id).toPromise().then
      (data => {
        this.reservation = data;
        console.log('before');
      }, error => {
        console.log(error);
      });


    console.log('after');
    this.printersToAdd = 0;
    this.laptopsToAdd = 0;
    this.foodToAdd = 0;
    this.ngOnInit();
    await this.getDetailReservation();

  }

  pickSomeToolToRemove(laptopsToAdd: number , printersToAdd: number): string[]{
   const res: string[] = [];
   if (laptopsToAdd < 0){
       const lapToRemove =  Math.abs(laptopsToAdd);
       for (let i = 0; i < lapToRemove; i++) {
       res.push(this.sortedTool.laptops[i].id);
     }

    }
   if (printersToAdd < 0){
      const lapToRemove =  Math.abs(printersToAdd);
      for (let i = 0; i < lapToRemove; i++) {
        res.push(this.sortedTool.printers[i].id);
      }
    }

   return res;
   }

   getDetailReservation(): void{
     this.reservation.start = new Date(this.reservation.start);
     this.reservation.end = new Date(this.reservation.end);
     this.sortedTool = this.sortToolBasic(this.reservation.tools);
     this.openSpaceService.getAvailable(new Date(this.reservation.start), this.reservation.room.openSpace.id).pipe(first())
       .subscribe(
         data => {
           this.reservationForDate = data.reservations;
           console.log(data);
           this.openSpaceService.readOne(this.reservation.room.openSpace.id).pipe(first()).subscribe(openSpace => {
             this.openSpace = openSpace;
             this.availableTool = this.sortTool(this.getAvailableTool());
             console.log(this.availableTool);

           }, error => {
             console.log(error);
           });

         },
         error => {
           console.log(error);
         });
   }

   formatDate(element){
    const start = new Date(element.start);
    return  this.weekday[start.getDay()] + ' ' + start.getDate()  + ' ' + this.month[start.getMonth()] + ' ' + start.getFullYear();
   }

   formatHour(element){
     const start = new Date(element.start);
     const end = new Date(element.end);
     return start.getHours() + ':00      --------->' + end.getHours() + ':00';
   }

   delete(){
    this.openSpaceService.delete(this.reservation.id).pipe(first()).subscribe(data => {
      this.printersToAdd = 0;
      this.laptopsToAdd = 0;
      this.foodToAdd = 0;
      this.ngOnInit();
      const description = document.getElementById('description');
      description.style.display = 'none';
    }, error => {
      console.log(error);
    });

   }
}
