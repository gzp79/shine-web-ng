import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthStateService, CurrentUser } from './services/auth-state.service';

@Component({
  selector: 'identity-login',
  template: `
    <div *ngIf="isLoading">
      <h1>Login... </h1>
    </div>
    <div *ngIf="!isLoading && currentUser === null">
      <h1>Logins TBD </h1>
    </div>
  `
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = true;
  currentUser: CurrentUser | null = null;
  currentUserSub: Subscription | null = null;

  constructor(private authStateService: AuthStateService, private router: Router) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.currentUserSub = this.authStateService.loginCurrentUser$().subscribe(
      (user) => {
        this.currentUser = user
        this.isLoading = false;
        this.currentUserSub?.unsubscribe()
        if (this.currentUser !== null) {
          this.router.navigate(['/app'])
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.currentUserSub?.unsubscribe()
  }
}
