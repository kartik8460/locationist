import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupsComponent } from '../popups/popups.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginForm: FormGroup;
  user = new User;
  error: string;
  url: string;
  url_parameters: {}
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('query')){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.height = '200px';
        dialogConfig.data = {mode:'popup', query: params.get('query')}
        let dialodRef = this.dialog.open(PopupsComponent, dialogConfig);
      }
      if(params.has('access')){
        if(params.has('id')){
          this.url_parameters = {id: params.get('id')}
        }
          this.url = `/${params.get('access')}`;
      }
    });
    this.loginForm=this.fb.group({
      email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['',Validators.required]
    })
  }
  onLogin() {
    this.error = null;
    if(this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.user.email = this.email.value;
    this.user.password = this.password.value;
    this.authService.login(this.user).subscribe(
      response => {
        console.log(response);
        if(response.success){

          this.authService.onLogin(response);
          if(this.url) {
            if(this.url_parameters){
              this.router.navigate([this.url,this.url_parameters]);
            }
            else{
              this.router.navigate([this.url]);
            }
          }
          else{
            this.router.navigate(["/"]);
          }
        }
        if(!response.success && response.message === 'Account Not Verified') {
          this.router.navigate(['/email-verification/', response.userId,{path: 'login'}])
        }
      },error => {
        this.error = error.error.message;
      }
    );
      this.isLoading = false;
  }

}
