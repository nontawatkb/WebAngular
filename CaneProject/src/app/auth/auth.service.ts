import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  httpOptions = {};

  dataUserProfile: any;

  constructor(private myRoute: Router, private http: HttpClient) {
    this.getUserProfile();
  }
  sendToken(token: string) {
    // console.log(token);
    localStorage.setItem("LoggedInUser", token);
  }

  getToken() {
    return localStorage.getItem("LoggedInUser");
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem("LoggedInUser");
    this.myRoute.navigate(["login"]);
    return true;
  }

  doLoginUsername(value) {
    let data = {
      username: value.username,
      password: value.password
    };

    this.http
      .post<any>(environment.API_URL + `api/auth/login`, data)
      .subscribe(result => {
      //  console.log(result);
      });
  }

  getUserProfile() {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.getToken()
      })
    };

    this.http
      .get<any>(environment.API_URL + `api/auth/getUser`, this.httpOptions)
      .subscribe(
        result => {
        //  console.log(result["data"]);
          this.dataUserProfile = result["data"];
          if (this.dataUserProfile.urlImage === "") {
            this.dataUserProfile.urlImage = "../../assets/icon/user2.png";
          }
        },
        error => {
        //  console.log(error);
          this.dataUserProfile = {};
          this.dataUserProfile.urlImage = "../../assets/icon/user2.png";
        },
        () => {}
      );
  }

  updateUser(data) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.getToken()
      })
    };

  //  console.log(this.getToken());

    this.http
      .post<any>(
        environment.API_URL + `api/auth/update`,
        data,
        this.httpOptions
      )
      .subscribe(
        result => {
        //  console.log(result);
          this.getUserProfile();
        },
        error => {
        //  console.log(error);
        }
      );
  }

  checkTokenExpired(): Promise<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.getToken()
      })
    };

   // console.log(this.httpOptions);

    return this.http
      .get<any>(environment.API_URL + `api/auth/me`, this.httpOptions)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return error.error;
  }
}
