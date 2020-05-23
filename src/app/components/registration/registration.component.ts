import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User, RegisterUser } from 'src/app/models/user';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/services/password.validator';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  isLoading: boolean = false;
  registrationForm: FormGroup;
  submitted: boolean = false;
  user = new RegisterUser;
  error: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  get email(){
    return this.registrationForm.get('email');
  }
  get name(){
    return this.registrationForm.get('name');
  }
  get confirmPassword() {
    return this.registrationForm.get('passwordGroup').get('confirmPassword');
  }
  get password() {
    return this.registrationForm.get('passwordGroup').get('password');
  }
  get passwordGroup() {
    return this.registrationForm.get('passwordGroup');
  }
  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required,Validators.min(8),Validators.max(16),Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,24}$")]],
        confirmPassword: ['', [Validators.required]]
      }, {validators: PasswordValidator})
    });
  }

  // PasswordValidator(control: AbstractControl): {[key:string]:boolean} | null {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');
  //   if (password.pristine || confirmPassword.pristine) {
  //     return null;
  //   }
  //   return password && confirmPassword && password.value !== confirmPassword.value? {'mismatch':true} : null;
  // }

  onRegister(){
    if(this.registrationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.user.name = this.name.value;
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    this.authService.register(this.user).subscribe(
      response => {
        if(response.success){
          this.isLoading = false;
          console.log(response);
          this.router.navigate(['/email-verification/',response.userId]);
        }
      },error => {
        this.error = error.error.message;
        this.isLoading = false;
      }

    )
  }


}
