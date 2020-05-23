import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isSideProfile: boolean = false;
  isAuthenticated: boolean = false;
  isAuthenticatedListener = new Subscription();
  userId: string;
  message:string;
  user:{user_name: string, profile_pic:string};
  changeProfilePicListener = new Subscription();
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated =  this.authService.getAuthStatus();
    if(this.isAuthenticated){
      this.user = this.authService.getUser();
    }
    this.userId =  this.authService.getUserId();
    this.isAuthenticatedListener = this.authService.getAuthStatusListener().subscribe(
      result => {
        this.isAuthenticated = result;
        if(this.isAuthenticated){
          this.user = this.authService.getUser();
        }
      })
    this.changeProfilePicListener = this.userService.profilePicUpdateListner().subscribe(result => this.user.profile_pic = result)
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.isAuthenticatedListener.unsubscribe();
    this.changeProfilePicListener.unsubscribe();
  }
}
