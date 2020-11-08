import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { } from 'googlemaps';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { WeatherCompComponent } from './weather-comp/weather-comp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'



@NgModule({
  declarations: [
    AppComponent,
    WeatherCompComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: WeatherCompComponent }
    ]),
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
