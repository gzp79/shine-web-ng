import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {
  }

  api_url: string = "https://cloud.scytta.com"
}
