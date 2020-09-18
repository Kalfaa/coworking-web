import { Injectable } from '@angular/core';
import {OpenSpace, Room, Tool, User} from './interface/login';
import {environment} from '../environments/environment';
import {map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(private http: HttpClient) { }

 /* post(name,openSpace){
    return this.http.post<Tool>(`${environment.apiUrl}/tool/`, {name,openSpace})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        console.log(resp);
  }))
  }*/

  read(): any{
    return this.http.get<Tool[]>(`${environment.apiUrl}/tool/`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }

  readOne(id): any{
    return this.http.get<Tool>(`${environment.apiUrl}/tool/${id}`)
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return resp;
      }));
  }



}
