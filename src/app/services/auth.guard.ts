import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log(route.url[0].parameters? true: false);
    console.log(route.url[0].path,route.url[0].parameters);
    const isAuth = this.authService.getAuthStatus();
    if(!isAuth) {
      if(route.url[0].path){
        if(route.url[0].parameters.id){
          this.router.navigate(['/login', {access: route.url[0].path , id: route.url[0].parameters.id}]);
        }
        else{
          this.router.navigate(['/login', {access: route.url[0].path}]);
        }
      }
      else {
        this.router.navigate(['/login']);
      }
    }
    return isAuth;
  }
}
