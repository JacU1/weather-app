import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private httpClient: HttpClient) { }

  public getWeather(location) {

    let url = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&appid=5ddf46564e9720543dbcb98d718f7e19'

    return this.httpClient.get(url);
  }

  public getHistoryWeather (lat,lon,time){
    
    let url = 'https://api.openweathermap.org/data/2.5/onecall/timemachine?lat='+lat+'&lon='+lon+'&dt='+time+'&appid=5ddf46564e9720543dbcb98d718f7e19'

    return this.httpClient.get(url);
  }

}
