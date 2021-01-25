import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private httpClient: HttpClient) { }

  public getWeather(location) {

    let url = 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=metric&appid=5ddf46564e9720543dbcb98d718f7e19'

    return this.httpClient.get(url);
  }

  public getHistoryWeather (lat,lon,time){
    
    let url = 'https://api.openweathermap.org/data/2.5/onecall/timemachine?lat='+lat+'&lon='+lon+'&dt='+time+'&units=metric&appid=5ddf46564e9720543dbcb98d718f7e19'

    return this.httpClient.get(url);
  }

  public getFutureWeather (lat,lon){

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,minutely&units=metric&appid=5ddf46564e9720543dbcb98d718f7e19'

    return this.httpClient.get(url);
  }

}
