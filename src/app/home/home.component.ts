import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/internal/operators';
import {OpenSpaceService} from '../open-space.service';
import {OpenSpace, WorkEvent} from '../interface/login';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  openSpaces: OpenSpace[];
  weekday = ['Lundi', ' Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  month = ['Janvier', ' Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private openSpaceService: OpenSpaceService) { }

  ngOnInit(): void {

    this.openSpaceService.read().pipe(first())
      .subscribe(
        data => {
          this.openSpaces = data;
          this.openSpaces.forEach( (openSpace) => {
            openSpace.events.sort((a, b) => {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              // @ts-ignore
              return new Date(b.date) - new Date(a.date);
            });
          });
        },
        error => {
          console.log(error);
        });
  }

  formatDateEvent(event: WorkEvent): string{
    const date: Date = new Date(event.date);
    return this.weekday[date.getDay()] + ' ' + date.getDate() + ' ' + this.month[date.getMonth()] + ' ' + date.getFullYear();
  }
}
