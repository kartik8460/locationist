import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User, RegisterUser } from "./../models/user";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private auth_url: string;
  private tokenTimer: any;
  private isAuthenticated = false;

  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {
    this.auth_url = "http://localhost:3000/api/user/";
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(){
    return {user_name: localStorage.getItem('user_name'), profile_pic: localStorage.getItem('profile_pic')};
  }

  getProfilePic(){
    return localStorage.getItem('profile_pic');
  }

  getAccountVerificationStatus() {
    return localStorage.getItem('isVerified');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  register(user: RegisterUser) {
    return this.http.post<{success:boolean, message: string, userId: string }>(`${this.auth_url}register`, user);
  }

  login(user: User) {
    return this.http.post<{ success:boolean, message:string, token: string, expiresIn: number, userId:string, isVerified:boolean, profile_pic: string, user_name: string }>(`${this.auth_url}login`, user);
  }

  onLogin(response) {
    const token = response.token;
    if (response.token) {
      console.log('response', response);
      const userId = response.userId;
      const isVerified = response.isVerified;
      const profile_pic = response.profile_pic;
      const user_name = response.user_name;
      const expirationDuration = response.expiresIn;
      this.setAuthTimer(expirationDuration);
      const expirationDate = new Date(new Date().getTime() + expirationDuration * 1000);
      this.saveAuthData(token, expirationDate, userId, isVerified, profile_pic, user_name);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  autoAuthUser() {
    const authInformation = this.getauthData();
    if(!authInformation) {
      return ;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, isVerified: boolean, profile_pic: string, user_name: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem("token", token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('isVerified', isVerified.toString())
    localStorage.setItem('profile_pic', profile_pic);
    localStorage.setItem('user_name', user_name);

  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem('isVerified');
    localStorage.removeItem('profile_pic');
    localStorage.removeItem('user_name');
  }

  private getauthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const isVerified = localStorage.getItem("isVerified");
    const profile_pic = localStorage.getItem("profile_pic");
    const user_name = localStorage.getItem("user_name");
    return !token || !expirationDate || !userId
      ? null
      : { token: token, expirationDate: new Date(expirationDate), userId: userId, isVerified: isVerified, profile_pic: profile_pic, user_name: user_name };
  }
}
