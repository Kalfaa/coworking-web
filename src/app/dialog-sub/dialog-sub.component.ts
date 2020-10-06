import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-sub',
  templateUrl: './dialog-sub.component.html',
  styleUrls: ['./dialog-sub.component.css']
})
export class DialogSubComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onNoClick() {
    return;
  }
}
