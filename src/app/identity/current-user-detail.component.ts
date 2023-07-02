import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentUser, AuthStateService } from './services/auth-state.service';

@Component({
  selector: 'identity-current-user-detail',
  template: `
    <div *ngIf="currentUser">
      <h2>Welcome, {{ currentUser }}!</h2>
      <!-- <p>Roles: {{ currentUser.roles.join(', ') }}</p> -->
    </div>
    <div *ngIf="!currentUser">
      <p>No user info available.</p>
    </div>
  `
})
export class CurrentUserDetailComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];

  constructor(private currentUserService: AuthStateService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.currentUserService.currentUser$.subscribe((user: CurrentUser | null) => {
      this.currentUser = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
