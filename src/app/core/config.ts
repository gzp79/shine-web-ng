import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  api_url: string = "https://cloud.scytta.com"
  //web_url: string = "https://local.scytta.com"
  web_url: string = "https://www.scytta.com"
}
