import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-weather-comp',
  templateUrl: './weather-comp.component.html',
  styleUrls: ['./weather-comp.component.scss']
})
export class WeatherCompComponent implements OnInit {

  constructor() {}
  weatherinput = new FormGroup(
    {
      location: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl('')
    }
  )
  
  ngOnInit(): void {
    this.initmap();
  }
  
  initmap():void{
    
    let input = document.getElementById("location") as HTMLInputElement;
    let searchBox = new google.maps.places.SearchBox(input);
    let markers: google.maps.Marker[] = [];

    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: {lat: 30, lng: -110}, 
      zoom: 8,
      mapId: 'weather-map' } as google.maps.MapOptions
    );

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });
  
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon as string,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
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

