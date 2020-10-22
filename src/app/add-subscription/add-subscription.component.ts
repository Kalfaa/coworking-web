import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogSubComponent} from '../dialog-sub/dialog-sub.component';
import {UserService} from '../user-service.service';
import {SubscriptionType, UserProfile} from '../interface/login';
import {first} from 'rxjs/internal/operators';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.css']
})
export class AddSubscriptionComponent implements OnInit {
  user: UserProfile;
  subType: SubscriptionType = SubscriptionType.NONE;
  constructor(public dialog: MatDialog, private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLogged()) {
      this.router.navigate(['login']);
    }
    this.userService.readById(this.authService.userValue.user.id).pipe(first())
      .subscribe(
        data => {
          this.user = data;
          if (this.user.subscription && this.user.subscription.type === SubscriptionType.RESIDENT){
            this.subType =  SubscriptionType.RESIDENT;
          }else if (this.user.subscription && this.user.subscription.type === SubscriptionType.SIMPLE){
            this.subType =  SubscriptionType.SIMPLE;
          }
        },
        error => {
          console.log(error);
        });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSubComponent, {
      data: {sub: 'SIMPLE'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userService.addSubscription( 'SIMPLE' as SubscriptionType, parseInt(result.month)).subscribe(
        data => {
         console.log(data);
        },
        error => {
          console.log(error);
        });
    });

  }

  openDialogRes() {
    const dialogRef = this.dialog.open(DialogSubComponent, {
      data: {sub: 'RESIDENT'}
    });
    dialogRef.afterClosed().subscribe(result => {
      const now: Date = new Date();
      this.userService.addSubscription( 'RESIDENT' as SubscriptionType, parseInt(result.month)).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
    });
  }
}
