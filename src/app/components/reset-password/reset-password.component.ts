import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import { PasswordValidator } from 'src/app/services/password.validator';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  isLoading: boolean = false;
  resetPasswordForm: FormGroup;
  error: string;
  token_verification: boolean = false;
  message: string;
  userId: string;
  token: string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}
  get password() {
    return this.resetPasswordForm.get('password');
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('userID') && paramMap.has('token') )
      {
        this.isLoading = true;
        this.userId = paramMap.get('userID');
        this.token = paramMap.get('token');
        this.userService.resetPasswordVerifyToken({userId: this.userId, token: this.token}).subscribe(
          response =>{
            if(response.success) {
              this.resetPasswordForm = this.fb.group({
                password: ['', [Validators.required,Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,24}$")]],
                confirmPassword: ['', [Validators.required]]
              }, {validators: PasswordValidator})
              this.isLoading = false;
              this.token_verification = true;
            }
          },
          error => {
            this.message= error.error.message;
            this.token_verification = false;
            this.isLoading = false;
          }
        );
      }
      else {
          this.message = "Invalid Request";
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const resetPassData = {password: this.password.value, userId: this.userId, token: this.token};
    this.isLoading = true;
    this.userService.resetPassword(resetPassData).subscribe(
      response => {

        if(response.success) {
          console.log(response);
          this.router.navigate(['/login',{query: 'passwordReset'}]);
        }

        else {
          console.log(response);
          this.message = response.message;
          this.isLoading = false;
        }
      },
      error=> {
        this.resetPasswordForm.reset();
        console.log(error);
        if(error.error.success){
          this.error = error.error.message
          this.isLoading = false;
          return;
        }
        console.log(error);
        this.message = error.error.message;
        this.isLoading = false;
      }
    );
  }
}
