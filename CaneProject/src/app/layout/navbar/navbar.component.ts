import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { environment } from "../../../environments/environment";

import { Router, RouterStateSnapshot } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }


  doLogout() {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      type: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.http
          .get<any>(environment.API_URL + `api/auth/logout`)
          .subscribe(
            result => {
              this.alertLogoutSuccess();
            },
            error => {
              //console.log(error['statusText']);
              this.alertLooutError();
            },
            () => {
            }
          );

      }
    })

  }

  alertLogoutSuccess() {
    Swal.fire({
      position: 'center',
      type: 'success',
      title: 'Logout Successfully',
      showConfirmButton: false,
      timer: 1500,
    }).then((result) => {
      this.auth.logout();
      this.router.navigate(['login']);
    });
  }

  alertLooutError() {
    Swal.fire({
      customClass: {
        title: 'text-red-500',
      },
      position: 'center',
      type: 'error',
      title: 'Logout Fail',
      showConfirmButton: false,
      timer: 1500,
    });

  }

}
