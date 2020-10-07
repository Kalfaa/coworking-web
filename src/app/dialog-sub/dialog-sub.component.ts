import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-sub',
  templateUrl: './dialog-sub.component.html',
  styleUrls: ['./dialog-sub.component.css']
})
export class DialogSubComponent implements OnInit {
  labelPosition: '1' | '8' |  '12' = '1';


  constructor(  public dialogRef: MatDialogRef<DialogSubComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
