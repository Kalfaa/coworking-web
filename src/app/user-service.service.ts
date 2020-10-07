import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {SubscriptionType, Tool, UserProfile} from './interface/login';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  read(): any{
    return this.http.get<UserProfile>(`${environment.apiUrl}/user/`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }


  readById( id: string): any{
    return this.http.get<UserProfile>(`${environment.apiUrl}/user/${id}`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }



  addSubscription( subType: SubscriptionType , month: number): any{
    return this.http.post<UserProfile>(`${environment.apiUrl}/user/addSubscription`,{subscriptionType: subType, month})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }
}
