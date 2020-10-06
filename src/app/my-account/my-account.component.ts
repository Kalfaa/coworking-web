import { Component, OnInit } from '@angular/core';
import {UserService} from '../user-service.service';
import {RoomAvailable, UserProfile} from '../interface/login';
import {AuthService} from '../auth.service';
import {first} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: UserProfile;
  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userService.readById(this.authService.userValue.user.id).pipe(first())
      .subscribe(
        data => {
            this.user = data;
        },
        error => {
          console.log(error);
        });
  }

  goToSub(){
    this.router.navigate(['/add-subscription']);
  }


}
