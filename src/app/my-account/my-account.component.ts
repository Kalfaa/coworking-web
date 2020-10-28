import { Component, OnInit } from '@angular/core';
import {UserService} from '../user-service.service';
import {RoomAvailable, SubscriptionType, UserProfile, WorkEvent} from '../interface/login';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {OpenSpaceService} from '../open-space.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: UserProfile;
  subscribe = 'Aucun abonnement';
  reslist = [];
  weekday = ['Lundi', ' Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  month = ['Janvier', ' Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  creationDate: string;

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private openSpaceService: OpenSpaceService) { }

  ngOnInit(): void {
    this.userService.readById(this.authService.userValue.user.id).pipe(first())
      .subscribe(
        data => {
            this.user = data;
            this.creationDate = this.formatDateEvent(this.user.created);
            console.log(this.user.subscription.type);
            if (this.user.subscription && this.user.subscription.type === SubscriptionType.RESIDENT){
              this.subscribe = 'Abonnement résident jusqu\'au : ' + this.user.subscription.end  ;

            }else if (this.user.subscription && this.user.subscription.type === SubscriptionType.SIMPLE){
              this.subscribe = 'Abonnement simple jusqu\'au : ' + this.user.subscription.end  ;
            }
        },
        error => {
          console.log(error);
        });
    this.openSpaceService.readReservation()
      .pipe(first())
      .subscribe(
        data => {
          // this.reservationForDate = data.reservations;
          this.reslist = data;
          // console.log(this.dataSource[0].room.openSpace.name);
        },
        error => {
          console.log(error);
        });
  }

  goToSub(){
    this.router.navigate(['/add-subscription']);
  }

  formatDateEvent(dateString: any){
    const date: Date = new Date(dateString);
    return this.weekday[date.getDay()] + ' ' + date.getDate() + ' ' + this.month[date.getMonth()] + ' ' + date.getFullYear();
  }


}
