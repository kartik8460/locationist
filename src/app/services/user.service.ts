import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserProfile } from "./../models/user";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user_url: string;
  changeProfilePicListener = new Subject<string>();
  constructor(private http: HttpClient) { this.user_url = "http://localhost:3000/api/user/"; }

  resetPasswordVerifyToken(passwordData) {
    return this.http.post<{success:boolean, message: string}>(`${this.user_url}reset-password/verify-token`, passwordData)
  }

  resetPassword(passwordData){
    return this.http.post<{success:boolean, message: string}>(`${this.user_url}reset-password-data`, passwordData);
  }

  forgetPassword(email: string) {
    const emailObj = {email: email};
    return this.http.post<{success:boolean, message: string}>(`${this.user_url}forgetPassword`, emailObj)
  }

  getUserDetailById(userId: string){
    return this.http.get<{success:boolean, message: UserProfile}>(`${this.user_url}user-details/${userId}`)
  }

  profilePicUpdateListner(){
    return this.changeProfilePicListener.asObservable();
  }

  onChangeProfilePic(profile_pic: string){
    localStorage.setItem('profile_pic', profile_pic);
    console.log('profile pic in service', profile_pic)
    this.changeProfilePicListener.next(profile_pic);
  }

  // verifyEmail() {
  //   const userId = {userId: this.getUserId()}
  //   return this.http.post<{success:boolean, message: string}>(`${this.user_url}verify-email-request`,userId)
  // }

  editProfileMain(userData){
    return this.http.put<{ success: boolean, message: string }>(`${this.user_url}edit-profile/main`, userData)
  }

  editProfileSocial(userData){
    return this.http.put<{ success: boolean, message: string }>(`${this.user_url}edit-profile/social`, userData)
  }

  changePassword(userData){
    return this.http.put<{ success: boolean, message: string }>(`${this.user_url}change-password`, userData)
  }

  updateCoverPhoto(userId:string, coverPicture: File) {
    const formData = new FormData();
    formData.append('_id',userId);
    formData.append('cover_pic', coverPicture, coverPicture.name)
    return this.http.put<{ success: boolean, message: string }>(`${this.user_url}cover-pic`, formData)
  }

  updateProfilePhoto(userId:string, profilePicture: File) {
    const formData = new FormData();
    formData.append('_id',userId);
    formData.append('profile_pic',profilePicture, profilePicture.name)
    return this.http.put<{ success: boolean, message: string, profile_pic: string }>(`${this.user_url}profile-pic`, formData)
  }

  emailVerification(userId: string) {
    return this.http.post<{success: boolean, message: string}>(`${this.user_url}verify-email-request`, { userId:userId })
  }
}
