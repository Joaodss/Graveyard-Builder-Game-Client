import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, shareReplay, Subject, tap } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = "http://localhost:8000"

  constructor(private http: HttpClient) { }

  public login(username: string, password: string) {
    const requestAuthBody = `username=${username}&password=${password}`;
    const requestOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<Object>(this.baseUrl + '/login', requestAuthBody, requestOptions).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    )
  }

  public logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn(): boolean {
    if (localStorage.getItem("access_token") == null || localStorage.getItem("expires_at") == null)
      return false;
    const isLogin = moment().isBefore(this.getExpiration());
    if (isLogin)
      return true;

    this.logout();
    return false;
  }


  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expires_at, 'millisecond');

    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration || "0");
    return moment(expiresAt);
  }

}
