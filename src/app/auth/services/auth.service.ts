import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interface/auth.interface';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;
  get user() {
    return { ...this._user };
  }
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };
    return this.http.post<AuthResponse>(url, body).pipe(
      tap((res) => {
        if (res.ok) {
          localStorage.setItem('token', res.token!);
          this._user = {
            name: res.name!,
            uid: res.uid!,
          };
        }
      }),
      map((res) => res.ok),
      catchError((err) => of(err.errors))
    );
  }

  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };
    return this.http.post<AuthResponse>(url, body).pipe(
      tap((res) => {
        if (res.ok) {
          localStorage.setItem('token', res.token!);
          this._user = {
            name: res.name!,
            uid: res.uid!,
          };
        }
      }),
      map((res) => res.ok),
      catchError((err) => of(err.errors))
    );
  }

  validateToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http
      .get<AuthResponse>(url, { headers })
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.token!);
          this._user = {
            name: res.name!,
            uid: res.uid!,
          };
          return res.ok;
        }),
        catchError((err) => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
