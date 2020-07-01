import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { UserProfile } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review';
import { PopupsComponent } from '../popups/popups.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string;
  userProfile = new UserProfile;
  isProfile: boolean;
  getPosts: boolean = false;
  getReviews:boolean = false;
  postsList: Post[];
  reviewsList: Review[];
  constructor(public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private reviewService: ReviewService) {

   }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has('userId')) {
      this.userId = paramMap.get('userId');
      if(this.userId === this.authService.getUserId()){
        this.router.navigate(['/my-profile']);
      }
    }
    else {
      this.userId = this.authService.getUserId();
      this.isProfile = true;
    }
  });

  this.userService.getUserDetailById(this.userId).subscribe(response => {
    if(response.success) {
      this.userProfile = response.message
      console.log(response);
      console.log(response.message)
    }
  });
  }

  tabSelected(event){
    if(event.index === 1 && !this.getPosts) {
      this.getPosts = true;
      this.postService.getPostsByUserId(this.userId).subscribe(response => {
        this.postsList = response.result;
      });
    }

    if(event.index === 2 && !this.getReviews) {
      this.getReviews = true;
      this.reviewService.getReviewsByUserId(this.userId).subscribe(response => {
        this.reviewsList = response.result;
      });
    }
  }

  editProfile(mode: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px';
    dialogConfig.data = {mode: mode, userId: this.userId, userProfile: this.userProfile}
    let dialogRef = this.dialog.open(EditProfileComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(result => {
      let success = result ==='false' ? false : true
      if(success){
        switch(mode){
          case 'profile':
            result._id = this.userId;
            console.log(result, ' kajsdhjukasgdjukashgdjhdsahjhdas')
            this.userService.editProfileMain(result).subscribe(response => {
              if(response.success){
                this.userProfile.first_name = result.first_name
                this.userProfile.last_name = result.last_name
                this.userProfile.dob = result.dob
                this.userProfile.from =result.from
                this.userProfile.phone_no = result.phone_no
                this.userProfile.gender = result.gender
                this.userProfile.about = result.about
                this.snackBar.open('Profile Updated Successfully',null,{duration:3000});
              }
            })
            break;

          case 'pic-cover':
            if(result.success){
              this.userProfile.cover_pic = result.cover_pic;
              this.snackBar.open('Cover Picture Updated Successfully',null,{duration:3000});
            }
            break;

          case 'pic-profile':
            console.log(result.profile_pic, 'xyz');
            if(result.success){
              this.userProfile.profile_pic = result.profile_pic;
              this.snackBar.open('Profile Picture Updated Successfully',null,{duration:3000});

              this.userService.onChangeProfilePic(result.profile_pic);
            }
            break;

          case 'social':
            result._id = this.userId;
            this.userService.editProfileSocial(result).subscribe(response => {
              if(response.success) {
                this.userProfile.social = result.social;
                this.snackBar.open('Social Accounts Updated Successfully',null,{duration:3000});
              }
            })
            break;

          case 'changePassword':
            this.snackBar.open('Password Updated Successfully',null,{duration:3000});
            break;
        }
      }
    })
  }

  gotoLocation(locationId: string) {
    this.router.navigate(['/location/',locationId])
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
