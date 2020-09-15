import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'coworking-web';
  constructor(private authService: AuthService) { }
  ngOnInit(): void {

  }

  isLogged(): boolean{
    return this.authService.isLogged();
  }

  logout(): void {
    return this.authService.logout();
  }
}
