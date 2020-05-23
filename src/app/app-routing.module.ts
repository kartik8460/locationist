import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { AddpostComponent } from "./components/addpost/addpost.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthGuard } from "./services/auth.guard";
import { UnAuthGuard } from "./services/un-auth.guard";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TestComponent } from './test/test.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReviewComponent } from './components/review/review.component';
import { LocationComponent } from './components/location/location.component';
import { NearbyLocationComponent } from './components/nearby-location/nearby-location.component';
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "profile/:userId", component: ProfileComponent },
  { path: "location/:locationId", component: LocationComponent },
  { path: "near-by-locations/:long/:lat", component: NearbyLocationComponent },
  { path: "advance-search", component: AdvanceSearchComponent },

  // UnAuthneticated users Routes
  { path: "login", component: LoginComponent, canActivate: [UnAuthGuard] },
  { path: "register", component: RegistrationComponent, canActivate: [UnAuthGuard] },
  { path: "email-verification/:userId", component: EmailVerificationComponent, canActivate: [UnAuthGuard] },
  { path: "forgot-password", component: ForgotPasswordComponent, canActivate: [UnAuthGuard] },
  { path: "reset-password/:userID/:token", component: ResetPasswordComponent, canActivate: [UnAuthGuard] },

  // Authneticated users Routes
  { path: "my-profile", component: ProfileComponent , canActivate: [AuthGuard] },
  { path: "add-review", component: ReviewComponent , canActivate: [AuthGuard] },
  { path: "add-post", component: AddpostComponent , canActivate: [AuthGuard] },
  { path: "edit_post/:postId", component: AddpostComponent, canActivate: [AuthGuard] },

  // Testing
  { path: "test", component: TestComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', // Add options right here
    })
  ],
  exports: [RouterModule],
  providers: [AuthGuard, UnAuthGuard],
})
export class AppRoutingModule {}
