import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, auditTime } from 'rxjs';

import { AuthStateService, CurrentUser } from './services/auth-state.service';
import { ConfigService } from '../core/config';

// It could be a better UX to show a longer loading screen even if data is ready, than have a short flickering
const AUDIT_TIME = 0

type ProviderInfo = {
  name: string,
  url: string,
}

@Component({
  selector: 'identity-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoadingUserInfo = true;
  currentUser: CurrentUser | null = null;
  currentUserSub: Subscription | null = null;
  providers: ProviderInfo[] | null = null;

  redirect_local: string = '/app'
  redirect_url() : string {
    return this.configService.web_url + this.redirect_local
  }

  constructor(
    private configService: ConfigService,
    private authStateService: AuthStateService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
  }

  isLoading(): boolean {
    return this.providers === null || this.isLoadingUserInfo
  }

  ngOnInit(): void {
    this.activeRoute.queryParams
      .subscribe(params => {
        this.redirect_local = params['redirect'] ?? '/app';
      })

    this.currentUserSub = this.authStateService.autoLogin().pipe(auditTime(AUDIT_TIME)).subscribe(
      (user) => {
        this.currentUser = user
        this.isLoadingUserInfo = false;
        if (this.currentUser !== null) {
          // if there is a valid user, navigate to the target
          this.router.navigate([this.redirect_local])
        }
      }
    )
    this.authStateService.getProviders().subscribe(
      (providers) => {
        this.providers = providers?.map(provider => {
          return {
            name: provider,
            url: `${this.configService.api_url}/identity/auth/${provider}/login?redirect=${this.redirect_url()}`
          } as ProviderInfo
        }) ?? []
        console.log("providers: ", providers)
      }
    )
  }

  ngOnDestroy(): void {
    this.currentUserSub?.unsubscribe()
  }
}
