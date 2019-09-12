import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TasksService {
  listTasksArea: any;

  httpOptions = {};

  constructor(private http: HttpClient, private auth: AuthService) {}


  getAllTasks(Areaid) {

    console.log(this.auth.getToken());
    

    this.listTasksArea = [];

    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

   // console.log(Areaid);

    let test = {
      idArea: Areaid
    };

    this.http
      .post<any>(
        environment.API_URL + `api/tasks/getAll`,
        test,
        this.httpOptions
      )
      .subscribe(
        result => {
          this.listTasksArea = result["data"];
         // console.log(this.listTasksArea);
          
        },
        error => {
          this.listTasksArea = [];
         // console.log(this.listTasksArea);
        },
        () => {}
      );
  }


  addTask(data, Areaid) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let newData = {
      doDate: data.doDate,
      title: data.title,
      detail: data.detail,
      status: data.status,
      idArea: Areaid,
    };

    this.http
      .post<any>(
        environment.API_URL + `api/tasks/add`,
        newData,
        this.httpOptions
      )
      .subscribe(
        result => {
      //    console.log(result);
          this.getAllTasks(Areaid);
        },
        error => {
      //    console.log(error);
        },
        () => { }
      );
  }



  deleteTask(Taskid, areaid) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let fill = {
      id: Taskid
    };

    this.http
      .post<any>(
        environment.API_URL + `api/tasks/delete`,
        fill,
        this.httpOptions
      )
      .subscribe(
        result => {
      //    console.log(result);
          this.getAllTasks(areaid);
        },
        error => {
      //    console.log(error);
        },
        () => { }
      );
  }

  
  deleteTaskAllByIdArea(areaid) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let fill = {
      idArea: areaid
    };

    this.http
      .post<any>(
        environment.API_URL + `api/tasks/deleteAllByIdArea`,
        fill,
        this.httpOptions
      )
      .subscribe(
        result => {
      //    console.log(result);
        },
        error => {
      //    console.log(error);
        },
        () => { }
      );
  }


  updateTask(Taskid, TaskData, areaid) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

  //  console.log(AreaData);

    let fill = {
      id: Taskid,
      doDate: TaskData.doDate,
      title: TaskData.title,
      status: TaskData.status,
    };

    this.http
      .post<any>(
        environment.API_URL + `api/tasks/update`,
        fill,
        this.httpOptions
      )
      .subscribe(
        result => {
       //   console.log(result);
          this.getAllTasks(areaid);
        },
        error => {
      //    console.log(error);
        },
        () => { }
      );
  }


}
