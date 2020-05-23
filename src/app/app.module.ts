import { BrowserModule            } from '@angular/platform-browser';
import { NgModule                 } from '@angular/core';
import { CommonModule             } from "@angular/common";
import { AppRoutingModule         } from './app-routing.module';
import { HttpClientModule         } from '@angular/common/http';
import { HTTP_INTERCEPTORS        } from '@angular/common/http';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { FormsModule              } from '@angular/forms';
import { ReactiveFormsModule      } from '@angular/forms';
import { MaterialModuleModule     } from './material-module.module';
import { GoogleMapsModule         } from '@angular/google-maps'
import { AgmCoreModule            } from '@agm/core';

import { AppComponent             } from './app.component';
import { LoginComponent           } from './components/login/login.component';
import { RegistrationComponent    } from './components/registration/registration.component';
import { AddpostComponent         } from './components/addpost/addpost.component';
import { HomeComponent            } from './components/home/home.component';
import { AuthInterceptor          } from './services/auth-interceptor';
import { ResetPasswordComponent   } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent  } from './components/forgot-password/forgot-password.component';
import { TestComponent            } from './test/test.component';
import { ProfileComponent         } from './components/profile/profile.component';
import { EditProfileComponent     } from './components/edit-profile/edit-profile.component';
import { LazyloadDirective        } from './lazyload.directive';
import { ReviewComponent          } from './components/review/review.component';
import { LocationComponent        } from './components/location/location.component';
import { AdvanceSearchComponent   } from './components/advance-search/advance-search.component';
import { NearbyLocationComponent  } from './components/nearby-location/nearby-location.component';
import { PopupsComponent } from './components/popups/popups.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ImageVideoComponent } from './components/image-video/image-video.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AddpostComponent,
    HomeComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    TestComponent,
    ProfileComponent,
    EditProfileComponent,
    LazyloadDirective,
    ReviewComponent,
    LocationComponent,
    AdvanceSearchComponent,
    NearbyLocationComponent,
    PopupsComponent,
    EmailVerificationComponent,
    ImageVideoComponent,
  ],

  entryComponents:[EditProfileComponent, PopupsComponent, ImageVideoComponent],

  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModuleModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule,
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyBeAVxOLh4J4tHxwCnqYOtJCyFigu3ji9g"
    })
  ],

  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],

  bootstrap: [AppComponent]
})
export class AppModule {  }
