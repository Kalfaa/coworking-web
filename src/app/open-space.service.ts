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

  readReservation(): any {
    return this.http.get<Reservation[]>(`${environment.apiUrl}/reservation/myReservation/`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  a(id: string): any {
    return this.http.get<Reservation>(`${environment.apiUrl}/reservation/${id}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  changeFood(reservationId: string, food: number): any{
    return this.http.post<OpenSpace>(`${environment.apiUrl}/reservation/${reservationId}/changeFood/`, {food})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  getAvailable(date: Date, openSpaceId: string): any {
    return this.http.get<Reservation[]>(`${environment.apiUrl}/reservation/available/${openSpaceId}/${date}`)
      .pipe(map(resp => {
        return resp;
      }));
  }

  reserve(reservation: ReservationCreation): any {
    return this.http.post<OpenSpace>(`${environment.apiUrl}/reservation/`, reservation)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  addToolsToReservation(reservationId: string, toolIds: string[]): any{
    return this.http.post<OpenSpace>(`${environment.apiUrl}/reservation/${reservationId}/addTools/`, {tools: toolIds})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  removeToolsToReservation(reservationId: string, toolIds: string[]): any{
    return this.http.post<OpenSpace>(`${environment.apiUrl}/reservation/${reservationId}/removeTools/`, {tools: toolIds})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

  delete(reservationId: string): any{
    return this.http.delete<Reservation>(`${environment.apiUrl}/reservation/${reservationId}`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
      }));
  }

}
