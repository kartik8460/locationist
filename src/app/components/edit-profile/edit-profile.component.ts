import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PasswordValidator } from 'src/app/services/password.validator';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profile_pic_error:string
  cover_pic_error:string
  editForm: FormGroup;
  cover_preview: string;
  profile_preview: string;
  urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userService: UserService, private dialogref: MatDialogRef<EditProfileComponent>) { }

  minDate: Date
  maxDate: Date
  // Main Profile
  get first_name(){
    return this.editForm.get('first_name');
  }
  get last_name(){
    return this.editForm.get('last_name');
  }
  get dob(){
    return this.editForm.get('dob');
  }
  get gender(){
    return this.editForm.get('gender');
  }
  get phone_no(){
    return this.editForm.get('phone_no');
  }
  get about(){
    return this.editForm.get('about');
  }
  get from(){
    return this.editForm.get('from');
  }
  get city() {
    return this.editForm.get('from').get('city');
  }
  get state() {
    return this.editForm.get('from').get('state');
  }

  // Social
  get instagram() {
    return this.editForm.get('social').get('instagram')
  }
  get facebook() {
    return this.editForm.get('social').get('facebook')
  }
  get twitter() {
    return this.editForm.get('social').get('twitter')
  }
  get youtube() {
    return this.editForm.get('social').get('youtube')
  }

  //Change Password
  get current_password() {
    return this.editForm.get('current_password')
  }
  get password() {
    return this.editForm.get('password')
  }
  get confirmPassword() {
    return this.editForm.get('confirmPassword')
  }

  //Cover Photo
  get cover_pic() {
    return this.editForm.get('cover_pic')
  }

  //Profile Photo
  get profile_pic() {
    return this.editForm.get('profile_pic')
  }



  ngOnInit() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear() - 13;
    this.maxDate = new Date(yyyy, mm, dd);

    switch(this.data.mode){
      case 'profile':
        this.editForm = this.fb.group({
          first_name: ['', Validators.required],
          last_name: ['', Validators.required],
          dob:[{value:'', disabled: true,},this.DateValidator],
          gender:[''],
          phone_no:['', [Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/)]],
          from: this.fb.group({
            city: [''],
            state:['']
          }),
          about:['']
        })
        break;

      case 'pic-cover':
        this.cover_preview = this.data.userProfile.cover_pic;
        this.editForm = this.fb.group({
          cover_pic:['', Validators.required]
        });
        break;

      case 'pic-profile':
        this.editForm = this.fb.group({
          profile_pic:['', Validators.required]
        });
        this.profile_preview = this.data.userProfile.profile_pic;
        break;

      case 'social':
        this.editForm = this.fb.group({
          social: this.fb.group({
            instagram:['', Validators.pattern(this.urlPattern)],
            facebook:['', Validators.pattern(this.urlPattern)],
            twitter:['', Validators.pattern(this.urlPattern)],
            youtube:['', Validators.pattern(this.urlPattern)]
          })
        });
        break;

      case 'changePassword':
        this.editForm = this.fb.group({
          current_password:['', Validators.required],
          password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,24}$")]],
          confirmPassword: ['', [Validators.required]]
        }, {validators: [PasswordValidator,this.PasswordMatchValidator]})
        break;
    }
    if(this.data.mode!== 'pic-cover' && this.data.mode !== 'pic-profile'){
      this.editForm.patchValue(this.data.userProfile);
    }
  }

  DateValidator(control: AbstractControl): {[key:string]:boolean} | null {
    const dob = control;
    const dobValue = new Date(dob.value)
    if( dobValue > new Date()) {
      dob.setValue(null);
      return {'greaterDate': true}
    }
    else{
      return null;
    }
  }

  changePassword() {
    let userdata = {
      _id: this.data.userProfile._id,
      current_password: this.current_password.value,
      new_password: this.password.value
    }
    this.userService.changePassword(userdata).subscribe(response => {
      if(response.success){
        this.dialogref.close(response);
      }
    })
  }

  selectCoverPhoto(event: Event) {
    const cover_pic = (event.target as HTMLInputElement).files[0];
    console.log(cover_pic.size);

    if((cover_pic.size / 1048576) > 30 || !this.validImageTypes.includes(cover_pic.type)){
      this.cover_pic_error = "File size Should be less than 30MB && It should be of type JPG/PNG/GIF";
      return;
    }

    this.editForm.patchValue({cover_pic: cover_pic});
    this.cover_pic.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.cover_preview = reader.result + '';
    }
    reader.readAsDataURL(cover_pic);
  }

  selectProfilePhoto(event: Event) {
    const profile_pic = (event.target as HTMLInputElement).files[0];
    if((profile_pic.size / 1048576) > 30 || !this.validImageTypes.includes(profile_pic.type)){
      this.profile_pic_error = "File size Should be less than 15MB & It should be of type JPG/PNG/GIF";
      return;
    }
    this.editForm.patchValue({profile_pic: profile_pic});
    this.profile_pic.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.profile_preview = reader.result + '';
    }
    reader.readAsDataURL(profile_pic);
  }

  updateCoverPhoto(){
    this.userService.updateCoverPhoto(this.data.userProfile._id, this.cover_pic.value).subscribe(response => {
      if(response.success){
        this.dialogref.close(response);
      }
    })
  }

  updateProfilePhoto() {
    this.userService.updateProfilePhoto(this.data.userProfile._id, this.profile_pic.value).subscribe(response => {
      if(response.success){
        this.dialogref.close(response);
      }
    })
  }

  PasswordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const current_password = control.get('current_password');
    const password = control.get('password');
    if (current_password.pristine || password.pristine) {
      return null;
    }
    return password && current_password && password.value === current_password.value? {'match': true} : null;
  }

}
