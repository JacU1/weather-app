import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../data.service';
import { getLocaleTimeFormat } from '@angular/common';
import { setgid } from 'process';
import { setClassMetadata } from '@angular/core/src/r3_symbols';

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
    newTime.setHours( newTime.getHours() - 2);
    let date =  todayDate + 'T' + newTime.toTimeString().slice(0,5) + ':00.000Z';
    let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));
    
    this.weatherApihandler('Koszalin',dateTime,todayDate,newTime.toTimeString().slice(0,5));
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
    return time.slice(11,16);
  }

  convertKtoC = (kelvin) => {
    
    let C = kelvin - 273.15;

    return Math.floor(C);
  }
  /*
  setdata = (options) => {
    let temp = this.convertKtoC(res1['current']['temp']);

    document.getElementById('inner_location').innerText = res['name'];
    document.getElementById('inner_temp').innerText = temp.toString() + ' °C';

    document.getElementById('inner_date').innerText = date ? date : new Date().toISOString().slice(0,10); 
    document.getElementById('inner_time').innerText = time ? time : this.getLocalTime(res1['timezone']); 


    let info = res1['current']['weather'].map(a => a.description).toString();
    console.log(info);

    document.getElementById('weather-label').innerText = info;
    
    switch(info){
      case 'overcast clouds' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/cloud1.PNG');
        break;
      case 'clear sky' :
        document.getElementById('icon_mod').setAttribute('src', 'assets/bigrain.png');
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
        document.getElementById('icon_mod').setAttribute('src', 'assets/rain.PNG');
        break;
    }
    this.mapchangehandler(res['coord']['lon'],res['coord']['lat']);
  }
  */

  weatherApihandler = (location, dateTime,date,time) => {
    this.dataservice.getWeather(location).subscribe((res) => {
      this.dataservice.getHistoryWeather(res['coord']['lat'],res['coord']['lon'],dateTime).subscribe((res1) =>{
        
        let temp = this.convertKtoC(res1['current']['temp']);


        document.getElementById('inner_location').innerText = res['name'];
        document.getElementById('inner_temp').innerText = temp.toString() + ' °C';
  
        document.getElementById('inner_date').innerText = date ? date : new Date().toISOString().slice(0,10); 
        document.getElementById('inner_time').innerText = time ? time : this.getLocalTime(res1['timezone']); 
  

        let info = res1['current']['weather'].map(a => a.description).toString();
        console.log(info);
  
        document.getElementById('weather-label').innerText = info;
        
        switch(info){
          case 'overcast clouds' :
            document.getElementById('icon_mod').setAttribute('src', 'assets/cloud1.PNG');
            break;
          case 'clear sky' :
            document.getElementById('icon_mod').setAttribute('src', 'assets/bigrain.png');
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
            document.getElementById('icon_mod').setAttribute('src', 'assets/rain.PNG');
            break;
        }
        this.mapchangehandler(res['coord']['lon'],res['coord']['lat']);
      });
    });
  }

  onSubmit = () => {
    var todayDate = new Date().toISOString().slice(0,10);
    let newTime = this.weatherinput.get('time').value ? this.weatherinput.get('time').value : '06:00';
    let newDate = this.weatherinput.get('date').value ? this.weatherinput.get('date').value : todayDate; 
    let location = this.weatherinput.get('location').value;
    let time = this.weatherinput.get('time').value;
    //console.log(newDate); 
    let date =  newDate + 'T' + newTime + ':00.000Z';
    console.log(date);
    let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));
    console.log(dateTime);
    
    this.weatherApihandler(location,dateTime,newDate,time);
    
    this.weatherinput.setValue({
      location: '',
      date: '',
      time: ''
    });
  }

  onLocation = (location) => {

    let todayDate = new Date().toISOString().slice(0,10);
    let newTime = '06:00';
    let date =  todayDate + 'T' + newTime + ':00.000Z';
    let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));

    this.weatherApihandler(location,dateTime,'','');    
  }
}

