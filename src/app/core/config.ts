import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  api_url: string = "https://cloud.scytta.com"
  web_url: string = "https://local.scytta.com"
}
