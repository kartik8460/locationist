import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY, Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';
import { LocationDetails } from 'src/app/models/location';
import { ReviewService } from 'src/app/services/review.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})

export class ReviewComponent implements OnInit, OnDestroy {
  location: LocationDetails;
  options: { _id: string; name: string }[];
  reviewForm: FormGroup;
  stars = [1, 2, 3, 4, 5];
  hovered: number;
  error: string;
  searchSubscription: Subscription;
  searchSubject = new Subject<string>();
  edit_mode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get rating() {
    return this.reviewForm.get('rating');
  }

  get review() {
    return this.reviewForm.get('review');
  }

  get locationId() {
    return this.reviewForm.get('locationId');
  }

  get userId() {
    return this.reviewForm.get('userId');
  }

  ngOnInit() {
    this.formInitialization();
  }

  formInitialization() {
    this.reviewForm = this.fb.group({
      _id: [''],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.required],
      locationId: ['', Validators.required],
      userId: ['', Validators.required],
    });
    this.userId.setValue(this.authService.getUserId());
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('locationId')) {
        let id = paramMap.get('locationId');
        console.log(id);
        this.optionSelected(id);
      }
    });
    this.subscribeToSearch();
  }

  subscribeToSearch() {
    this.searchSubscription = this.searchSubject .pipe(
      debounceTime(450),
      distinctUntilChanged(),
      switchMap(query => {
        if (query) {
          return this.locationService.searchLocation(query);
        }
        this.options = null;
        return EMPTY;
      })
    )
    .subscribe((response) => {
      console.log(response);
      this.options = response.result;
    });
  }

  onKeyupSearch(query) {
    this.searchSubject.next(query);
  }

  displayfn(subject) {
    return subject ? subject.name : undefined;
  }

  optionSelected(id: string) {
    this.locationId.setValue(id);
    this.locationService.getLocationPreview(id).subscribe((response: any) => {
      console.log(this.userId.value, this.locationId.value);
      this.reviewService.getReviewByUserAndLocationId(this.userId.value, this.locationId.value).subscribe(review => {
        if(review.success){
          this.edit_mode = true;
          this.reviewForm.patchValue(review.result);
          this.reviewForm.updateValueAndValidity();
        }
      });
      this.location = response.result;
    });
  }

  rated(star: number) {
    this.error = null;
    this.rating.patchValue(star);
  }

  onSubmit() {
    console.log(this.edit_mode)
    console.log(this.reviewForm.value, 'value');
    if (!this.rating.value) {
      this.error = 'Please share some ratings out of 5 stars';
    }
    if(this.edit_mode) {
      this.reviewService.updateReview(this.reviewForm.value).subscribe(
        response =>  {
          if(response.success){
            this.router.navigate(['/'])
          }
        },
        err => console.log(err)
      );
    }
    else{
      this.reviewService.addReview(this.reviewForm.value).subscribe(
        response =>  {
          if(response.success){
            this.router.navigate(['/'])
          }
        },
        err => console.log(err)
      );
    }
  }

  changeLocation() {
    this.options = null;
    this.edit_mode = false;
    this.reviewForm.reset();
    this.userId.setValue(this.authService.getUserId());
    this.location = null;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

}
