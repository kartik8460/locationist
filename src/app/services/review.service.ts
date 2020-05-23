import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  review_url: string;

  constructor(private http: HttpClient) { this.review_url = "http://localhost:3000/api/review/"; }

  addReview(reviewData: Review){
    return this.http.post<{success: boolean, message: string}>(`${this.review_url}add-review`, reviewData)
  }

  getReviewByUserAndLocationId(userId: string, locationId: string){
    return this.http.get<{ success: boolean, result: Review }>(`${this.review_url}by-user-location/${userId},${locationId}`)
  }

  updateReview(reviewDetails){
    return this.http.put<{success: boolean, message: string}>(`${this.review_url}update-review`,reviewDetails)
  }

  getTopReviews(){
    return this.http.get<{success: boolean, result: Review[]}>(`${this.review_url}top-reviews`)
  }

  getReviewsByUserId(userId: string){
    return this.http.get<{success: boolean, result: Review[]}>(`${this.review_url}by-user/${userId}`)
  }

  getReviewsByLocationId(locationId: string){
    return this.http.get<{success: boolean, result: Review[]}>(`${this.review_url}by-location/${locationId}`)
  }

  deleteReview(reviewId: string){
    return this.http.delete(`${this.review_url}${reviewId}`);
  }

}
