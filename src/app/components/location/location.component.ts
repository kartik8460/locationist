import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LocationDetails } from 'src/app/models/location';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PostService } from 'src/app/services/post.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review';
import { Post } from 'src/app/models/post';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PopupsComponent } from '../popups/popups.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow
  infocontent: string;
  locationDetails: LocationDetails;
  getPosts: boolean = false;
  getReviews:boolean = false;
  postsList: Post[];
  reviewsList: Review[];
  isAuthenticated:boolean = false;
  isAuthenticatedListener = new Subscription();
  userId: string;
  constructor(
    private locationService: LocationService,
    private route:ActivatedRoute,
    private postService: PostService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((parmas:ParamMap) => {
      this.getLocation(parmas.get('locationId'));
    })
    this.isAuthenticated = this.authService.getAuthStatus();
    this.userId = this.authService.getUserId();
    this.isAuthenticatedListener = this.authService.getAuthStatusListener().subscribe(result => {
      this.isAuthenticated = result;
      this.userId = this.authService.getUserId();
    })
  }

  getLocation(locationId){
    this.locationService.getLocationById(locationId).subscribe((location:any) =>{
      this.locationDetails = location.result;
      console.log(this.locationDetails)
    });
  }

  openInfo(marker: MapMarker, content: string) {
    this.infocontent = content;
    this.infoWindow.open(marker);
  }
  tabSelected(event){
    if(event.index === 2 && !this.getPosts) {
      this.getPosts = true;
      this.postService.getPostsByLocationId(this.locationDetails._id).subscribe(response => {
        this.postsList = response.result;
        console.log(this.postsList)
      });
    }

    if(event.index === 1 && !this.getReviews) {
      this.getReviews = true;
      this.reviewService.getReviewsByLocationId(this.locationDetails._id).subscribe(response => {
        this.reviewsList = response.result;
      });
    }
  }

  gotoProfile(userId: string) {
    if(userId == this.userId){
      this.router.navigate(['/my-profile']);
    }
    else{
      this.router.navigate(['/profile/',userId]);
    }
  }

  deletePost(id: string, i: number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {mode: 'delete', type: 'post'}
    let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(answer => {
      if(answer){
        this.postService.deletePost(id).subscribe((response) => {
          this.postsList.splice(i, 1);
        });
      }
    })
  }

  deleteReview(id: string, i:number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {mode: 'delete', type: 'review'}
    let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(answer => {
      if(answer){
        this.reviewService.deleteReview(id).subscribe(response => {
          this.reviewsList.splice(i, 1);
        });
      }
    })
  }
}
