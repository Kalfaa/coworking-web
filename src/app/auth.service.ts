import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ILogin, User} from './interface/login';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

 /* login(): Observable<ILogin>{
    const  http = this.http.get<ILogin>(this.loginUrl);
    http.subscribe(
      res => console.log('HTTP response', res),
      err => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.')
    );
    return http;
  }*/
  isLogged(): boolean{
    const user = localStorage.getItem('user');
    if (!user){
      console.log('NOT CONNECTED');
      return false;
    }
    return true;
  }
  public get userValue(): User {
    return this.userSubject.value;
  }

 login(username, password): any {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { username, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(username, password): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { username, password, email: 'blabla@bla.fr'  });
  }


  update(id, params): Observable<object> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }
}
