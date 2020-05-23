import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  isLoading:boolean;
  userId: string;
  message: string;
  resend: boolean;
  invalid: boolean = false;
  constructor(private userService: UserService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('userId');
      console.log(this.userId);
      if(params.get('path') == 'login'){
        this.message= "Please Verify Your Account Before login"
      }
      else{
        this.resend = true;
        this.emailVerificationRequest(this.userId);
      }
    });
  }

  resendLink(){
    this.resend = true;
    this.emailVerificationRequest(this.userId);
  }

  emailVerificationRequest(userId: string) {
    this.userService.emailVerification(userId).subscribe(response => {
      this.message = response.message;
    }, err => {
      this.invalid = true;
      this.message = err.error.message
    }
  )};

}
