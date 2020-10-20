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
  constructor(private openSpaceService: OpenSpaceService) { }

  ngOnInit(): void {

    this.openSpaceService.read().pipe(first())
      .subscribe(
        data => {
          this.openSpaces = data;
        },
        error => {
          console.log(error);
        });
  }

}
