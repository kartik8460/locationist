import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean = false;
  forgotPasswordForm: FormGroup;
  error: string;
  message:string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  get email() {
    return this.forgotPasswordForm.get("email");
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")]]
    });

  }
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.error = null;
    this.isLoading = true;
    const email = this.email.value;
    this.userService.forgetPassword(email).subscribe(
      response => {
        console.log(response)
        if(response.success) {
          this.message = response.message;
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          },5000)
        }
      },
      error =>{
        console.log(error)
        this.error = error.error.message;
        this.isLoading = false;
      }
    );
  }
}
