import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.auth.getToken()
    })
  };


  constructor(private auth: AuthService, private myRoute: Router, private http: HttpClient) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {



    return this.auth.checkTokenExpired()
      .then(result => {

        if (result['auth'] != true) {
          //console.log(result);

          // Swal.fire({
          //   position: 'center',
          //   type: 'error',
          //   title: 'กรุณาล็อกอิน',
          //   showConfirmButton: false,
          //   timer: 1500
          // }).then((res) => {
          // });
          this.myRoute.navigate(['login']);

          return false;
        } else {
          //console.log(result);
          return true;
        }
      })
      .catch(error => {
        console.log(error);
        this.myRoute.navigate(['login']);
        return false;
      });

  }

}
