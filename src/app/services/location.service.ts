import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LocationDetails, Location, LocationPreview } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  location_url: string;

  constructor(private http: HttpClient) { this.location_url = "http://localhost:3000/api/location/"; }

  searchLocation(query: string) {
    return this.http.get<{success:boolean, result: Location[]}>(`${this.location_url}search-location/${query}`);
  }

  getLocationById(locationId: string) {
    return this.http.get<{success: boolean, result: LocationDetails}>(`${this.location_url}location-details/${locationId}`);
  }

  getLocationPreview(locationId: string) {
    return this.http.get<{ success: boolean, result: LocationPreview }>(`${this.location_url}location-preview/${locationId}`)
  }

  getNearByLocation(long: number, lat: number){
    return this.http.get<{success: boolean, result: LocationDetails[]}>(`${this.location_url}/near-by/${long}/${lat}`)
  }

  advanceSearch(filters: any){
    return this.http.post<{success: boolean, result: LocationDetails[]}>(`${this.location_url}advance-search`, filters)
  }

}
