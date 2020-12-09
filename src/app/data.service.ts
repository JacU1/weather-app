import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = 'http://api.openweathermap.org/data/2.5/weather?q=london&appid=5ddf46564e9720543dbcb98d718f7e19';

  constructor(private httpClient: HttpClient) { }


  public sendGetRequest() {
    return this.httpClient.get(this.REST_API_SERVER);
  }

}
