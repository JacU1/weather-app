import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../data.service';

declare var ol: any;

@Component({
  selector: 'app-weather-comp',
  templateUrl: './weather-comp.component.html',
  styleUrls: ['./weather-comp.component.scss']
})
export class WeatherCompComponent implements OnInit {

  constructor(private dataservice: DataService) {

  }
  weatherinput = new FormGroup(
    {
      location: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl('')
    }
  )

  map: any;

  ngOnInit(): void {
    this.initmap();
  }

  initmap(): void {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([73.8567, 18.5204]),
        zoom: 8
      })
    });
  }

  onSubmit() {
    console.log(this.weatherinput.value);
    this.dataservice.sendGetRequest().subscribe((data: any[]) => {
      console.log(data);
    });
    this.weatherinput.setValue({
      location: '',
      date: '',
      time: ''
    });
  }
}

