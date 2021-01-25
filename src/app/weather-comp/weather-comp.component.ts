import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../data.service';


declare var ol: any;
declare var require: any

@Component({
  selector: 'app-weather-comp',
  templateUrl: './weather-comp.component.html',
  styleUrls: ['./weather-comp.component.scss']
})
export class WeatherCompComponent implements OnInit {

  constructor(private dataservice: DataService) {

  }

  map: any;

  weatherinput = new FormGroup(
    {
      location: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl('')
    }
  )


  ngOnInit(): void {
    let todayDate = new Date().toISOString().slice(0,10);
    //let newTime = new Date().toTimeString().slice(0,5);
    let newTime = new Date();
    newTime.setHours( newTime.getHours());
    let date =  todayDate + 'T' + newTime.toTimeString().slice(0,5) + ':00.000Z';
    //let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));
    
    this.weatherApihandler('Koszalin',0,todayDate,newTime.toTimeString().slice(0,5));
  }

  initmap = (lon,lat,target) => {
    this.map = new ol.Map({
      target: target,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 8
      })
    });
  }

  mapchangehandler = (lon,lat) => {

    var oldmap = document.getElementById('map');

    var newmap = document.createElement('div');
    newmap.setAttribute('id','map');
    newmap.setAttribute('style','height: 500px; width: 40%;')

    document.getElementById('maps-contaier-class').replaceChild(newmap,oldmap);

    this.initmap(lon,lat,'map');
  }
  
  getLocalTime = (timezone) => {
    var moment = require('moment-timezone');
    var time = moment().tz(timezone).format(); 
    //console.log(time);
    return time;
  }

  convertKtoC = (kelvin) => {
    
    let C = kelvin - 273.15;

    return Math.floor(C);
  }

  futureWeather = (res,date,time,type,location,dateTime) => {
    this.dataservice.getFutureWeather(res['coord']['lat'],res['coord']['lon']).subscribe((res1) => {
      console.log(res1);
      this.setWeatherInfo(res1,date,time,type,location,dateTime);
    });
  }

  pastWeather = (res,dateTime,date,time,type,location) => {
    this.dataservice.getHistoryWeather(res['coord']['lat'],res['coord']['lon'],dateTime).subscribe((res1) =>{
      console.log(res1);
        this.setWeatherInfo(res1,date,time,type,location,dateTime);
    });
  }
  
  weatherApihandler = (location, dateTime,date,time) => {

    let currentDateTime = parseInt((new Date().getTime() / 1000).toFixed(0)) + 3600;


    this.dataservice.getWeather(location).subscribe((res) => {

    if(dateTime == 0){
      this.setWeatherInfo(res,date,time,1,res['name'],dateTime);
    }else if (currentDateTime < dateTime){
      this.futureWeather(res,date,time,2,res['name'],dateTime);
    }else if (currentDateTime > dateTime){
      this.pastWeather(res,dateTime,date,time,3,res['name']);
    }
  });
  }

    setWeatherInfo = (res,date,time,type,location,dateTime) => {
      console.log(res);

      switch(type){
        case 1 :  //current
        console.log(res);
        document.getElementById('inner_location').innerText = location;
        document.getElementById('inner_temp').innerText = Math.floor(res['main']['temp']) +' °C';
        let newDateTime = this.getLocalTime(new Date().toTimeString().slice(0,5));
        console.log(newDateTime,newDateTime.slice(0,10),newDateTime.slice(11,16));
        let timezone = res['dt'] - res['timezone'];
        console.log(timezone);
        document.getElementById('inner_date').innerText = date ? date : new Date(timezone * 1000);
        document.getElementById('inner_time').innerText = time ? time : newDateTime.slice(11,16) +' + '+newDateTime.slice(20,25); 
        document.getElementById('inner_wind').innerText = Math.floor(res['wind'].speed).toString() + ' km/h';
        document.getElementById('inner_presure').innerText = res['main']['pressure'] + ' hPa';

        let info = res['weather'].map(a => a.description).toString();
        document.getElementById('weather-label').innerText = info;

        this.mapchangehandler(res['coord']['lon'],res['coord']['lat']);
        this.IconSwitch(info);
          break;

        case 2 :  //future
        console.log(res);
        document.getElementById('inner_location').innerText = location;
        
        let getDay = res['daily'].map(a => a.dt);

        var closest = getDay.reduce(function(prev, curr) {
          return (Math.abs(curr - dateTime) < Math.abs(prev - dateTime) ? curr : prev);
        });

        console.log(closest);
        let index = res['daily'].filter(a => a.dt == closest);

        console.log(index[0].temp.day);

        document.getElementById('inner_temp').innerText = Math.floor(index[0].temp.day) + ' °C';
        document.getElementById('inner_date').innerText = date;
        document.getElementById('inner_time').innerText = time; 
        document.getElementById('inner_wind').innerText = Math.floor(index[0].wind_speed).toString() + ' km/h';
        document.getElementById('inner_presure').innerText = index[0].pressure + ' hPa';

        let info1 = index[0].weather[0].description;
        document.getElementById('weather-label').innerText = info1;

        this.mapchangehandler(res['lon'],res['lat']);
        this.IconSwitch(info1);
          break;

        case 3 :  //hisotry
        document.getElementById('inner_location').innerText = location;
        document.getElementById('inner_temp').innerText = Math.floor(res['current']['temp']) + ' °C';
        document.getElementById('inner_date').innerText = date; 
        document.getElementById('inner_time').innerText = time;
        document.getElementById('inner_wind').innerText = Math.floor(res['current']['wind_speed']).toString() + ' km/h';
        document.getElementById('inner_presure').innerText = res['current']['pressure'] + ' hPa';
        
        let info2 = res['current']['weather'][0].description;
        document.getElementById('weather-label').innerText = info2;

        this.mapchangehandler(res['lon'],res['lat']);
        this.IconSwitch(info2);
          break;
      }
    }

  IconSwitch = (info) => {
    switch(info){
      case 'overcast clouds' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/scattered clouds.PNG');
        break;
      case 'clear sky' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/sun2.png');
        break;
      case 'broken clouds' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/brokenclouds.PNG');
        break;
      case 'scattered clouds' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/scattered clouds.PNG');
        break;
      case 'few clouds' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/cloud1.PNG');
        break;
      case 'light rain' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/rain.PNG');
        break;
      case 'light snow' : 
        document.getElementById('icon_mod').setAttribute('src', 'assets/snow.PNG');
        break;
      case 'thunderstorm with rain,moderate rain' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/rain.PNG');
        break;
      case 'snow' : 
        document.getElementById('icon_mod').setAttribute('src', 'assets/snow.PNG');
        break;
      case 'light snow,mist' : 
        document.getElementById('icon_mod').setAttribute('src', 'assets/snow.PNG');
        break;
      }
  }
       

  onSubmit = () => {
    let location = this.weatherinput.get('location').value;

    let newTime = this.weatherinput.get('time').value;
    let newDate = this.weatherinput.get('date').value;

    let date = newDate.toString();
    
    let date1 = date.slice(0,15) + ' ' + newTime;

    let dateTime = parseInt((new Date(date1).getTime() / 1000).toFixed(0)) + 3600;  // nie wiem czemu po policzeniu milisekund zawsze brakowało jednej godziny, więc musiałem ją dodać ręcznie 

    this.weatherApihandler(location,dateTime ? dateTime: 0,date ? date.slice(0,15) : 0 ,newTime ? newTime : 0);  
  }

  onLocation = (location,zone) => {
    let localDataTime = this.getLocalTime(zone);
    let time = localDataTime.slice(11,16);
    let date = localDataTime.slice(0,10);
    this.weatherApihandler(location,0,date,time);    
  }

  OnDateChange = (date) =>{
    console.log(date);
    console.log(this.weatherinput.get('date').value);
  }

  OnTimeChange = (time) =>{
    console.log(time);
    console.log(this.weatherinput.get('time').value);
  }

  onReset = () => {
    this.weatherinput.setValue({
      location: '',
      date: '',
      time: ''
    });
  }

}

