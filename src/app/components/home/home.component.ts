import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostService } from "../../services/post.service";
import { Post } from "../../models/post";
import { AuthService } from "src/app/services/auth.service";
import { Subscription, Subject, EMPTY} from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageVideoComponent } from '../image-video/image-video.component';
import { PopupsComponent } from '../popups/popups.component';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  random: number;
  cover_src: string;
  reviews: Review[];
  postData: Post[] = [];
  isAuthenticated:boolean = false;
  isAuthenticatedListener = new Subscription();
  userId: string;
  searchOptions:{ _id: string; name: string }[];
  searchSubscription :Subscription;
  searchSubject = new Subject<any>();
  constructor (
    private postService: PostService,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router,
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.random = Math.floor(Math.random() * 10) + 1;
    this.cover_src =`../../../../assets/home_cover-${this.random}.jpg`;
    this.getReviews();
    this.isAuthenticated = this.authService.getAuthStatus();
    this.userId = this.authService.getUserId();
    this.isAuthenticatedListener = this.authService.getAuthStatusListener().subscribe(result => {
      this.isAuthenticated = result;
      this.userId = this.authService.getUserId();
    })

    this.postService.getPosts().subscribe((result) => {
      this.postData = result;
    });

    this.searchSubscription = this.searchSubject.pipe(debounceTime(450), distinctUntilChanged(),switchMap(query => {
      if(query) {
        this.isLoading = true;
        return this.locationService.searchLocation(query);
      }
      else {
        this.searchOptions = null;
        return EMPTY;
      }
    })).subscribe(response => {
      this.isLoading = false;
      this.searchOptions = response.result;
    })
  }

  ngOnDestroy() {
    this.isAuthenticatedListener.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  getReviews(){
    this.reviewService.getTopReviews().subscribe(reviews =>{
     this.reviews = reviews.result;
     console.log(this.reviews);
  })
}

  nearby(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        this.router.navigate([`/near-by-locations/${position.coords.longitude}/${position.coords.latitude}`])
      });
    }
  }

  optionSelected(option){
    if(option == 'Near By'){
      this.nearby();
    }
    else{
      this.router.navigate(['/location/',option._id])
    }
  }

  onKeyUpSearch(query: string) {
    this.searchSubject.next(query);
  }

  deletePost(id: string, i: number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {mode: 'delete', type: 'post'}
    let dialogRef = this.dialog.open(PopupsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(answer => {
      if(answer){
        this.postService.deletePost(id).subscribe((response) => {
          this.postData.splice(i, 1);
        });
        console.log('Post Deleted')
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
          this.reviews.splice(i, 1);
        })
      }
    })
  }

  showMedia(mode: string, url: string) {
    console.log(mode, url);
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '700px';
    dialogConfig.maxHeight = '700px';
    dialogConfig.data = {mode: mode, url: url}
    let dialogRef = this.dialog.open(ImageVideoComponent, dialogConfig);
  }

}
