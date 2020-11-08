import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-weather-comp',
  templateUrl: './weather-comp.component.html',
  styleUrls: ['./weather-comp.component.scss']
})
export class WeatherCompComponent implements OnInit {

  constructor() {

  }
  ngOnInit(): void {

  }

  weatherinput = new FormGroup(
    {
      location: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl('')
    }
  )

  newfunction() {

  }

  onSubmit() {
    console.log(this.weatherinput.value);
    this.weatherinput.setValue({
      location: '',
      date: '',
      time: ''
    });
  }
}

