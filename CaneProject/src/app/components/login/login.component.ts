import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validator } from "@angular/forms";
import { Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { environment } from "../../../environments/environment";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { AreaService } from 'src/app/service/areaService/area.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  message: string;
  Outpage = false;
  myLoading = false;
  tex = "asdasdsd";
  formLogin: FormGroup;
  dismissible = true;


  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "x-access-token": this.auth.getToken()
    })
  };

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private area: AreaService,
  ) {
    this.FormLoginControl();
  }

  ngOnInit() {}

  FormLoginControl() {
    this.formLogin = this.builder.group({
      username: [""],
      password: [""]
    });
  }

  tryLogin() {
    let data = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password
    };

    this.http
      .post<any>(environment.API_URL + `api/auth/login`, data)
      .subscribe(
        result => {
          this.auth.sendToken(result["token"]);
          this.alertLoginSuccess();
          this.auth.getUserProfile();
        this.area.getAllArea();
       // console.log(result["token"]);
        
        },
        error => {
          //console.log(error["statusText"]);
          this.alertLoginError();
        },
        () => {}
      );
  }

  loadingAlert() {
    Swal.fire({
      title: "กำลังเข้าสู่ระบบ..",
      allowOutsideClick: false,
      width: 300,
      timer: 1500,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    }).then(result => {
      this.tryLogin();
    });
  }

  alertLoginSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "Login Successfully",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
     // console.log(this.auth.getToken());

      this.router.navigate(["home"]);
    });
  }

  alertLoginError() {
    Swal.fire({
      position: "center",
      width: 300,
      type: "error",
      title: "เข้าสู่ระบบไม่สำเร็จ",
      showConfirmButton: false,
      timer: 1500
    });
  }

  showToken() {
   // console.log(this.auth.getToken());
  }
}
