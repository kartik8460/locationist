import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupsComponent } from '../popups/popups.component';
import { LocationService } from 'src/app/services/location.service';
import { LocationDetails } from 'src/app/models/location';
import { Router } from '@angular/router';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css']
})
export class AdvanceSearchComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  searchKey: string;
  infocontent: string;
  filters: {
    location_type: string,
    state_ut: string,
    city: string
  } = {location_type: null, state_ut: null, city: null}
  locationsList: LocationDetails[];
  center = {};
  zoom: number = 8;
  constructor(public dialog: MatDialog, private locationService: LocationService, private router: Router) { }

  ngOnInit() {

  }

  filterSearch() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {mode: 'advance_search_filter', filters: this.filters}
    let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(filters => {
      if(filters) {
        this.filters = filters;
        if(filters.state_ut){
          this.zoom = filters.city? 12: 8;
        }
        this.search();
      }
    });
  }

  search(){
    if(!this.filters.location_type && !this.filters.state_ut && !this.filters.city && !this.searchKey){
      let dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.data = {mode: 'searchParamsAbsent'}
      let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
    }
    else{
      this.filters["searchKey"] = this.searchKey? this.searchKey: null;
      this.locationService.advanceSearch(this.filters).subscribe(response => {
        console.log(response)
        if(response.result.length > 0) {
          this.locationsList = response.result;
          this.center = {
            lat: this.locationsList[0].loc.coordinates[1],
            lng: this.locationsList[0].loc.coordinates[0]
          }
        }
        else {
          let dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = false;
          dialogConfig.data = {mode: 'noAdvanceResults'}
          let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
        }
      })
    }
  }

  goToLocation(locationId: string){
    console.log('exec')
    this.router.navigate(['/location/',locationId])
  }

  openInfo(marker: MapMarker, content: string) {
    this.infocontent = content;
    this.infoWindow.open(marker)
  }
}
