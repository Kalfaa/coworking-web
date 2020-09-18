import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OpenSpace} from '../interface/login';
import {OpenSpaceService} from '../open-space.service';
import {first} from 'rxjs/internal/operators';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedValue: string;
  openSpaces: OpenSpace[];


  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  cars = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'}
  ];

  constructor(private formBuilder: FormBuilder, public openSpaceService: OpenSpaceService) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.openSpaceService.read().pipe(first())
      .subscribe(
        data => {
          this.openSpaces = data;
        },
        error => {
          console.log(error);
        });
  }

  orgValueChange(value: any): void{
    console.log(value);
  }

  getOpenSpaces(): OpenSpace[] {
    return (this.openSpaces ) ? this.openSpaces : [];
  }

}
