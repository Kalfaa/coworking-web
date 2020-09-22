import { Injectable } from '@angular/core';
import {OpenSpace, Reservation, ReservationCreation, User} from './interface/login';
import {environment} from '../environments/environment';
import {map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenSpaceService {

  constructor(private http: HttpClient) { }


  post(name, description): any{
    return this.http.post<OpenSpace>(`${environment.apiUrl}/openspace/`, { name, description})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
  }));
  }

  read(): any{
    return this.http.get<OpenSpace[]>(`${environment.apiUrl}/openspace/`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }

  readOne(id): any{
    return this.http.get<OpenSpace>(`${environment.apiUrl}/openspace/${id}`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }

  addTool(name, openSpaceId): any{
    return this.http.post<OpenSpace>(`${environment.apiUrl}/openspace/${openSpaceId}/addTool`, {name})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  getAvailable(date: Date, openSpaceId): any {
    return this.http.get<Reservation>(`${environment.apiUrl}/reservation/available/'${openSpaceId}/${date}`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  reserve(reservation: ReservationCreation): any {
    return this.http.post<OpenSpace>(`${environment.apiUrl}/reservation/`, reservation)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

}
