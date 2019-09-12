import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { TasksService } from "../tasksService/tasks.service";

@Injectable({
  providedIn: "root"
})
export class AreaService {
  listAreaUser: any;

  httpOptions = {};

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private tasks: TasksService
  ) {
    this.getAllArea();
  }

  getAllArea() {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let test = {
      id: this.auth.dataUserProfile._id
    };

    this.http
      .post<any>(
        environment.API_URL + `api/area/getAll`,
        test,
        this.httpOptions
      )
      .subscribe(
        result => {
          // console.log(result);
          this.listAreaUser = result["data"];
        },
        error => {
          // console.log(error);
          this.listAreaUser = [];
        },
        () => {}
      );
  }

  addArea(data, positionMap, markerCenter) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let newData = {
      idArea: data.idArea,
      idCustomer: this.auth.dataUserProfile._id,
      nameArea: data.nameArea,
      nameCustomer: data.nameCustomer,
      typeArea: data.typeArea,
      typePlant: data.typePlants,
      namePlantsCode: data.namePlantsCode,
      yearProduct: data.yearProduct,
      productofAcre: 0,
      nameProject: data.nameProject,
      distancArea: data.areaDistance,
      statusCut: "ยังไม่ตัด",
      centerMarker: markerCenter,
      mapArray: positionMap
    };

    this.http
      .post<any>(
        environment.API_URL + `api/area/add`,
        newData,
        this.httpOptions
      )
      .subscribe(
        result => {
          //    console.log(result);
          this.getAllArea();
        },
        error => {
          //    console.log(error);
        },
        () => {}
      );
  }

  deleteArea(Areaid) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    let fill = {
      id: Areaid
    };

    this.http
      .post<any>(
        environment.API_URL + `api/area/delete`,
        fill,
        this.httpOptions
      )
      .subscribe(
        result => {
          //    console.log(result);
          this.tasks.deleteTaskAllByIdArea(Areaid);
          this.getAllArea();
        },
        error => {
          //    console.log(error);
        },
        () => {}
      );
  }

  updateArea(Areaid, AreaData) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.auth.getToken()
      })
    };

    //  console.log(AreaData);

    let fill = {
      id: Areaid,
      idArea: AreaData.idArea,
      nameArea: AreaData.nameArea,
      nameCustomer: AreaData.nameCustomer,
      typeArea: AreaData.typeArea,
      typePlant: AreaData.typePlants,
      namePlantsCode: AreaData.namePlantsCode,
      yearProduct: AreaData.yearProduct,
      productofAcre: AreaData.productofAcre,
      nameProject: AreaData.nameProject,
      statusCut: AreaData.statusCut
    };

    this.http
      .post<any>(
        environment.API_URL + `api/area/update`,
        fill,
        this.httpOptions
      )
      .subscribe(
        result => {
          //   console.log(result);
          this.getAllArea();
        },
        error => {
          //    console.log(error);
        },
        () => {}
      );
  }
}
