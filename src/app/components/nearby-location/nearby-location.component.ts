import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LocationService } from './../../services/location.service';
import { LocationDetails } from './../../models/location';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-nearby-location',
  templateUrl: './nearby-location.component.html',
  styleUrls: ['./nearby-location.component.css']
})
export class NearbyLocationComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow
  infocontent: string;
  center: google.maps.LatLngLiteral
  userOption: google.maps.MarkerOptions = {
    icon: {url: '/assets/my_location.png'}
  }
  isLoading: boolean = false;
  latitude: number;
  longitude: number;
  locationDetails: LocationDetails[];
  constructor(private route: ActivatedRoute, private locationService: LocationService, private router: Router ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.longitude = parseFloat(paramMap.get('long'));
      this.latitude = parseFloat(paramMap.get('lat'));
      this.center = {
        lat: this.latitude,
        lng: this.longitude
      }
      this.getLocation(this.longitude, this.latitude)
    })
  }

  getLocation(long, lat) {
    this.isLoading = false;
    this.locationService.getNearByLocation(long, lat).subscribe(response => {
      this.locationDetails = response.result
      console.log(this.locationDetails)
    })
  }

  openInfo(marker: MapMarker, content: string) {
    this.infocontent = content;
    this.infoWindow.open(marker)
  }

  goToLocation(locationId: string){
    this.router.navigate(['/location/',locationId])
  }

}
