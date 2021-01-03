import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../data.service';
import { getLocaleTimeFormat } from '@angular/common';

declare var ol: any;

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
    let newTime = '06:00';
    let date =  todayDate + 'T' + newTime + ':00.000Z';
    let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));
    this.weatherApihandler('Koszalin',dateTime);
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

  weatherApihandler = (location, dateTime) => {
    this.dataservice.getWeather(location).subscribe((res) => {
      this.dataservice.getHistoryWeather(res['coord']['lat'],res['coord']['lon'],dateTime).subscribe((res1) =>{
        console.log(res1);
        
        document.getElementById('inner_location').innerText = res['name'];
        document.getElementById('inner_temp').innerText = res1['current']['temp'];
  
        document.getElementById('inner_date').innerText = this.weatherinput.get('date').value ? this.weatherinput.get('date').value : new Date().toISOString().slice(0,10); 
        document.getElementById('inner_time').innerText = this.weatherinput.get('time').value ? this.weatherinput.get('time').value : this.getLocalTime(res1['timezone']); 
  
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
        }
        this.mapchangehandler(res['coord']['lon'],res['coord']['lat']);
      });
    });
  }

  onSubmit = () => {

    var todayDate = new Date().toISOString().slice(0,10);
    let newTime = this.weatherinput.get('time').value ? this.weatherinput.get('time').value : '12:00';
    let newDate = this.weatherinput.get('date').value ? this.weatherinput.get('date').value : todayDate; 
    //console.log(newDate); 
    let date =  newDate + 'T' + newTime + ':00.000Z';
    console.log(date);
    let dateTime = parseInt((new Date(date).getTime() / 1000).toFixed(0));
    console.log(dateTime);
    
    this.weatherApihandler(this.weatherinput.get('location').value, dateTime);
    
    this.weatherinput.setValue({
      location: '',
      date: '',
      time: ''
    });
  }
}

