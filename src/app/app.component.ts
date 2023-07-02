import { Component } from '@angular/core';

import { CurrentUserDetailComponent } from './identity/current-user-detail.component';
import { AuthStateService } from './identity/services/auth-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shine-web';
}
