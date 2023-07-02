import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from 'src/app/core/config';
import { BehaviorSubject, Observable, catchError, delay, from, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface CurrentUser {
  id: string,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser$: Observable<CurrentUser | null>;

  constructor(private config: ConfigService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public loginCurrentUser$(): Observable<CurrentUser | null> {
    //todo: try to log in with stored credentials and than get the info
    return this.getUserInfo$()
  }

  public getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  private getUserInfo$(): Observable<CurrentUser | null> {
    let url = `${this.config.api_url}/identity/api/identities/userinfo`

    return this.http.get(url, { withCredentials: true }).pipe(
      catchError(err => {
        if (err.status === 401) {
          return of(null)
        } else {
          throw new Error(err)
        }
      }),
      //delay(3000),
      map(x => x as CurrentUser),
      tap(x => this.currentUserSubject.next(x))
    );
  }
}

export const authGuard = () => {
  const authState = inject(AuthStateService)
  const router = inject(Router)

  let user = authState.getCurrentUser();
  return user === null ? router.navigate(['/login']) : true
}
