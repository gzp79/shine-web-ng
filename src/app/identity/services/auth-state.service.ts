import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from 'src/app/core/config';
import { BehaviorSubject, Observable, catchError, delay, from, map, of, tap } from 'rxjs';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

export interface CurrentUser {
  id: string,
  name: string,
}

class AuthApi {
  constructor(private config: ConfigService, private http: HttpClient) { }

  public getUserInfo(): Observable<CurrentUser | null> {
    let url = `${this.config.api_url}/identity/api/identities/userinfo`

    return this.http.get(url, { withCredentials: true }).pipe(
      catchError(err => {
        if (err.status === 401) {
          return of(null)
        } else {
          throw new Error(err)
        }
      }),
      map(x => x as CurrentUser),
    );
  }

  public getProviders(): Observable<string[] | null> {
    let url = `${this.config.api_url}/identity/api/auth/providers`

    return this.http.get(url, { withCredentials: true }).pipe(
      map(x => x as string[]),
    );
  }

}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService extends AuthApi {
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser$: Observable<CurrentUser | null>;

  constructor(config: ConfigService, http: HttpClient) {
    super(config, http)
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public autoLogin(): Observable<CurrentUser | null> {
    //todo: try to login with any stored credentials before getting credentials
    return this.getUserInfo().pipe(
      tap(x => this.currentUserSubject.next(x))
    )
  }

  public getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }
}

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authState = inject(AuthStateService)
  const router = inject(Router)

  let user = authState.getCurrentUser();
  let targetUrl = state.url ?? '/app'
  let queryParams = targetUrl === '/app' ? {} : { redirect: state.url }
  return user === null ? router.navigate(['/login'], { queryParams }) : true
}
