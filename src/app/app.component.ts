import { Component } from '@angular/core';

import { CurrentUserDetailComponent } from './identity/current-user-detail.component';
import { AuthStateService } from './identity/services/auth-state.service';
import { ConfigService } from './core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shine-web';
  logout_url: string;

  constructor(private configService: ConfigService) {
    this.logout_url = `${configService.api_url}/identity/auth/logout?redirect=${configService.web_url}`
  }
}
