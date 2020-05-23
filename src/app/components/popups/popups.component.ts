import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.css']
})
export class PopupsComponent implements OnInit {
  location_types: string[] = ['Chruch','Temple', 'Mosque', 'Educational', 'Historical', 'Museum', 'Garden', 'Beach', 'Village', 'Park', 'Dam', 'Lake'];
  filters: {
    location_type: string,
    state_ut: string,
    city: string
  } = {location_type: null, state_ut: null, city: null}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PopupsComponent>) { }
  states = ['Daman and Diu', 'Gujarat'];
  cities: string[];
  mode: string;
  message: string;

  ngOnInit() {
    this.mode = this.data.mode;
    if(this.mode == 'advance_search_filter' && this.data.filters){
      this.filters = this.data.filters;
      if(this.data.filters.state_ut){
        this.onSelectState(this.data.filters.state_ut);
      }
    }
    if(this.mode == 'popup'){
      if(this.data.query === 'passwordReset') {
        this.message = `You have SuccessFully Reseted Your Password`;
      }
      if(this.data.query === 'accountVerified'){
        this.message = `You have SuccessFully Verified Your Account & Now you can login`;
      }
    }
  }

  onSelectState(value: string) {
    if(value === 'Daman and Diu') {
      this.cities = ['Diu'];
    }

    if(value === 'Gujarat') {
      this.cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'];
    }

    if(!value){
      this.filters.city = null;
    }
  }

  applyFilters() {
    this.dialogRef.close(this.filters);
  }

}
