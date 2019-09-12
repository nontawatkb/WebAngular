import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { MapsAPILoader, MouseEvent, LatLngLiteral } from "@agm/core";
declare const google: any;
import Swal from "sweetalert2";
import { AuthService } from "src/app/auth/auth.service";
import { AreaService } from "src/app/service/areaService/area.service";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  SwalPartialTargets,
  SwalComponent,
  CloseEvent
} from "@sweetalert2/ngx-sweetalert2";
import { TasksService } from "src/app/service/tasksService/tasks.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { environment } from "src/environments/environment";
import { interval } from "rxjs/internal/observable/interval";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  // @ViewChild('AgmMap', { static: true }) map: any;
  @ViewChild("SwalFormAddArea", { static: true })
  private SwalFormAddArea: SwalComponent;
  @ViewChild("SwalShowAddArea", { static: true })
  private SwalShowAddArea: SwalComponent;
  @ViewChild("SwalShowUser", { static: true })
  private SwalShowUser: SwalComponent;
  @ViewChild("SwalShowInfo", { static: true })
  private SwalShowInfo: SwalComponent;
  @ViewChild("SwalTaskArea", { static: true })
  private SwalTaskArea: SwalComponent;
  @ViewChild("SwalAddTask", { static: true })
  private SwalAddTask: SwalComponent;
  @ViewChild("SwalDetailTask", { static: true })
  private SwalDetailTask: SwalComponent;
  @ViewChild("SwalSearchArea", { static: true })
  private SwalSearchArea: SwalComponent;
  @ViewChild("SwalListArea", { static: true })
  private SwalListArea: SwalComponent;
  @ViewChild("SwalChooseTypeArea", { static: true })
  private SwalChooseTypeArea: SwalComponent;
  @ViewChild("SwalInfomationArea", { static: true })
  private SwalInfomationArea: SwalComponent;
  @ViewChild("SwalShowImageFull", { static: true })
  private SwalShowImageFull: SwalComponent;

  @ViewChild("AgmMap", { static: true }) map: any;

  selectTypeListArea = "grid";

  selectTypeSearch = "";

  AreaFilter: any = { nameArea: "", idArea: "", statusCut: "", typeArea: "" };

  polygon: any;

  triangleCoords = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 }
  ];

  listMapType = [
    {
      name: "Normal",
      key: "roadmap",
      img: "../../../assets/icon/map/normal.png",
      active: false
    },
    {
      name: "Terrain",
      key: "terrain",
      img: "../../../assets/icon/map/ter.png",
      active: false
    },
    {
      name: "Satellite",
      key: "satellite",
      img: "../../../assets/icon/map/sat.png",
      active: false
    },
    {
      name: "Hybrid",
      key: "hybrid",
      img: "../../../assets/icon/map/hybrid.png",
      active: true
    }
  ];

  MapTypeCurrent = "hybrid";

  drawingManager: any;
  distanceArea = 0.0;
  distanceBetween = 0.0;
  bsValue = new Date();

  menuShow = false;

  typeSelectAreaPoly: any;

  title = "My first AGM project";

  latitude: number;
  longitude: number;

  latitudeUser: number;
  longitudeUser: number;

  zoom: number;

  addAreaStatus = false;
  editStatus = false;
  addTaskStatus = false;
  editTaskStatus = false;

  betweenLat: number;
  betweenLng: number;

  iconName = "../../../assets/icon/map-marker.png";

  colorKey = ["#33FF00", "#FFFF00", "#FF3300"];
  PinKey = [
    "../../../assets/icon/mapType1.png",
    "../../../assets/icon/mapType2.png",
    "../../../assets/icon/mapType3.png"
  ];

  statusArea = ["อ้อยตอ 1", "อ้อยตอ 2", "อ้อยตอ 3"];

  dataShowArea: any;
  dataShowTask: any;
  dataSearchArea: any;

  userImage: null;

  currentsPolygon = [];
  currentCenter = [];

  formAddArea: FormGroup;
  formEditArea: FormGroup;
  formAddTask: FormGroup;
  formEditTask: FormGroup;
  formSearch: FormGroup;
  formSearchListArea: FormGroup;

  locale = "th";

  latClick: null;
  lngClick: null;
  testImg = "../../../assets/icon/pin2.png";

  colorPolygon = "#FF4500";
  colorPolyline = "#ffffff";
  lines = [];

  pathsPolygon = [];
  pathsPolyline = [];

  AreaSet = {
    acre: 0,
    job: 0,
    wa: 0
  };

  StatusLocationCurrent = false;

  imageUser = "";
  selectFileImage = null;

  dataUser: any;
  UploadPicStatus = false;
  formUpload: FormGroup;

  //CallAreaInfomation

  InfomationArea: any = {
    AreaAllCount: 0,
    AreaAllDistance: 0,
    T1AllCount: 0,
    T1AllDistance: 0,
    T2AllCount: 0,
    T2AllDistance: 0,
    T3AllCount: 0,
    T3AllDistance: 0,
    CutAllCount: 0,
    CutAllDistance: 0,
    notCutAllCount: 0,
    notCutAllDistance: 0
  };

  source: any;

  subscription: Subscription;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public auth: AuthService,
    public area: AreaService,
    private http: HttpClient,
    public readonly swalTargets: SwalPartialTargets,
    private builder: FormBuilder,
    public tasks: TasksService,
    private localeService: BsLocaleService
  ) {
    this.userImage = this.auth.dataUserProfile.urlImage;
    this.localeService.use(this.locale);
    console.log(this.auth.dataUserProfile);

    this.formUpload = this.builder.group({
      file: [null, Validators.required]
    });
    this.imageUser = this.auth.dataUserProfile.urlImage;
  }

  ngOnInit() {
    this.setCurrentLocation();
    this.FormAddAreaControl();
    this.FormAddTaskControl();
    this.FormSearchContol();
    this.FormSearchListContol();
  }

  ChangeStatusLocation(status) {
    if (status === true) {
      this.StatusLocationCurrent = true;

      const source = interval(1000);

      this.subscription = source.subscribe(val => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            
            if(this.latitudeUser === position.coords.latitude && this.longitudeUser === position.coords.longitude) {
              console.log('not change');
              
            }else{
              this.latitudeUser = position.coords.latitude;
              this.longitudeUser = position.coords.longitude;
              console.log(this.latitudeUser, this.longitudeUser);
            }
          });
        }


        

      });
    } else {
      this.StatusLocationCurrent = false;

      this.subscription.unsubscribe();
    }
  }

  zoomChange(event) {
    // console.log(event);
    this.zoom = event;
  }

  onSelect(event) {
    console.log(event);
  }

  ChangeMapType(index) {
    for (let i = 0; i < this.listMapType.length; i++) {
      this.listMapType[i].active = false;
      if (i === index) {
        this.listMapType[i].active = true;
      }
    }

    // Swal.fire({
    //   text: "กำลังโหลดแผนที่",
    //   allowOutsideClick: false,
    //   width: 300,
    //   timer: 1000,
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // }).then(result => {
    //   this.SwalChooseTypeArea.show();
    // });
    this.MapTypeCurrent = this.listMapType[index].key;
  }

  centerChange(event) {
    this.betweenLat = event.lat;
    this.betweenLng = event.lng;

    if (this.pathsPolyline.length >= 1) {
      this.pathsPolyline[this.pathsPolyline.length - 1] = {
        lat: this.betweenLat,
        lng: this.betweenLng
      };
    }

    if (this.pathsPolyline.length >= 2) {
      this.distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(
          this.pathsPolyline[this.pathsPolyline.length - 1].lat,
          this.pathsPolyline[this.pathsPolyline.length - 1].lng
        ),
        new google.maps.LatLng(
          this.pathsPolyline[this.pathsPolyline.length - 2].lat,
          this.pathsPolyline[this.pathsPolyline.length - 2].lng
        )
      );
    }
  }

  FormAddAreaControl() {
    this.formAddArea = this.builder.group({
      idArea: ["", Validators.required],
      nameArea: ["", Validators.required],
      nameCustomer: ["", Validators.required],
      areaDistance: ["", Validators.required],
      typePlants: ["", Validators.required],
      namePlantsCode: [""],
      yearProduct: [""],
      nameProject: ["", Validators.required],
      typeArea: ["", Validators.required]
    });
  }

  FormSearchContol() {
    this.formSearch = this.builder.group({
      idArea: [null]
    });
  }

  FormSearchListContol() {
    this.formSearchListArea = this.builder.group({
      text: [null],
      type: [null]
    });
  }

  FormEditAreaControl(dataArea) {
    this.formEditArea = this.builder.group({
      idArea: [dataArea.idArea, Validators.required],
      nameArea: [dataArea.nameArea, Validators.required],
      areaDistance: [dataArea.distancArea, Validators.required],
      nameCustomer: [dataArea.nameCustomer, Validators.required],
      typePlants: [dataArea.typePlant, Validators.required],
      namePlantsCode: [dataArea.namePlantsCode],
      yearProduct: [dataArea.yearProduct],
      nameProject: [dataArea.nameProject, Validators.required],
      typeArea: [dataArea.typeArea, Validators.required],
      productofAcre: [dataArea.productofAcre],
      statusCut: [dataArea.statusCut, Validators.required]
    });
  }

  FormAddTaskControl() {
    this.formAddTask = this.builder.group({
      doDate: [null, Validators.required],
      title: [null, Validators.required],
      detail: [null, Validators.required],
      status: [null, Validators.required]
    });
  }

  FormEditTaskControl(dataTask) {
    let newDate = new Date(dataTask.doDate);
    this.formEditTask = this.builder.group({
      doDate: [newDate, Validators.required],
      title: [dataTask.title, Validators.required],
      status: [dataTask.status, Validators.required]
    });
  }

  focusMarkerArea($event) {
    this.latitude = $event.latitude;
    this.longitude = $event.longitude;
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    if ("geolocation" in navigator) {
      Swal.fire({
        title: "ค้นหาตำแหน่ง...",
        allowOutsideClick: false,
        width: 300,
        timer: 1500,
        onBeforeOpen: () => {
          this.area.getAllArea();
          Swal.showLoading();
        }
      }).then(result => {
        navigator.geolocation.getCurrentPosition(position => {
          this.latitudeUser = position.coords.latitude;
          this.longitudeUser = position.coords.longitude;
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 16;
        });
      });
    }
  }

  onMapReady(map) {
    //console.log("asd");
    this.map = map;
    console.log("map ready");
  }

  mapClicked(data) {}

  addPathDraw() {
    this.pathsPolygon.push({ lat: this.betweenLat, lng: this.betweenLng });
    this.pathsPolyline.push({ lat: this.betweenLat, lng: this.betweenLng });

    let newArray = Array<any>();

    for (var i = 0; i < this.pathsPolygon.length; i++) {
      newArray.push(this.pathsPolygon[i]);
    }

    this.pathsPolygon = newArray;
    this.pathsPolyline = newArray;

    //console.log(this.pathsPolygon);

    if (this.polygon) {
      this.polygon.setMap(null);
      console.log("set null");
    }

    this.polygon = new google.maps.Polygon({
      paths: this.pathsPolygon,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: false,
      draggable: false
    });

    this.polygon.setMap(this.map);
    this.getPolygonCoordinates(this.polygon);

    this.pathsPolyline.push({ lat: this.betweenLat, lng: this.betweenLng });
    console.log(this.pathsPolyline);
    console.log(this.pathsPolygon);
  }

  BackDragDraw() {
    if (this.pathsPolygon.length >= 5) {
      let newArray = Array<any>();

      for (var i = 0; i < this.pathsPolygon.length - 4; i++) {
        newArray.push(this.pathsPolygon[i]);
      }

      this.pathsPolygon = newArray;
      this.pathsPolyline = newArray;

      if (this.polygon) {
        this.polygon.setMap(null);
        console.log("set null");
      }

      this.polygon = new google.maps.Polygon({
        paths: this.pathsPolygon,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: false,
        draggable: false
      });

      this.polygon.setMap(this.map);
      this.getPolygonCoordinates(this.polygon);

      this.pathsPolyline.push({ lat: this.betweenLat, lng: this.betweenLng });
      console.log(this.pathsPolyline);
      console.log(this.pathsPolygon);
    }
  }

  getPolygonCoordinates(draggablePolygon) {
    this.distanceArea = google.maps.geometry.spherical.computeArea(
      draggablePolygon.getPath()
    );
    const len = draggablePolygon.getPath().getLength();
    console.log(len);
    this.currentCenter = [];
    const polyArrayLatLng = [];
    var centerLat = 0.0;
    var centerLng = 0.0;

    for (let i = 0; i < len; i++) {
      const vertex = draggablePolygon.getPath().getAt(i);
      const vertexLatLng = { lat: vertex.lat(), lng: vertex.lng() };
      polyArrayLatLng.push(vertexLatLng);

      centerLat = centerLat + vertex.lat();
      centerLng = centerLng + vertex.lng();
    }

    centerLat = centerLat / len;
    centerLng = centerLng / len;
    this.currentsPolygon = polyArrayLatLng;
    this.currentCenter.push({ lat: centerLat, lng: centerLng });

    this.AreaSet.acre = (this.distanceArea - (this.distanceArea % 1600)) / 1600;
    this.AreaSet.job =
      ((this.distanceArea % 1600) - ((this.distanceArea % 1600) % 400)) / 400;
    this.AreaSet.wa =
      (((this.distanceArea % 1600) % 400) -
        (((this.distanceArea % 1600) % 400) % 4)) /
      4;
  }

  OpenDragDraw() {
    this.distanceBetween = 0;
    this.distanceArea = 0;
    this.addAreaStatus = true;
    this.AreaSet.acre = 0;
    this.AreaSet.job = 0;
    this.AreaSet.wa = 0;
    this.menuShow = false;
  }

  ConfirmDrag() {
    this.currentsPolygon = this.pathsPolygon;

    // console.log(this.currentsPolygon);

    if (this.currentsPolygon.length < 7) {
      const Toast = Swal.mixin({
        toast: true,
        width: 310,
        position: "center",
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: "error",
        title: "ต้องลากอย่างน้อย 3 จุด และเชื่อมต่อกัน"
      });
    } else {
      this.currentsPolygon.splice(this.currentsPolygon.length - 1, 1);
      this.formAddArea.patchValue({
        idArea: null,
        nameArea: null,
        namePlantsCode: null,
        areaDistance: this.distanceArea,
        nameCustomer: this.auth.dataUserProfile.name,
        typePlants: "อ้อย",
        yearProduct: "2562",
        nameProject: "อ้อยยอด",
        typeArea: "0"
      });
      this.SwalFormAddArea.show();
    }
  }

  ClearDrag() {
    if (this.polygon) {
      this.polygon.setMap(null);
      console.log("set null");
    }

    this.pathsPolyline = [];
    this.pathsPolygon = [];

    this.addAreaStatus = false;
    this.distanceArea = 0;
  }

  loadingAddArea(time) {
    Swal.fire({
      title: "กำลังบันทึกข้อมูล..",
      width: 300,
      animation: false,
      timer: time,
      customClass: {
        popup: "animated tada"
      },
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    }).then(result => {
      this.area.addArea(
        this.formAddArea.value,
        this.currentsPolygon,
        this.currentCenter
      );

      this.alertAddAreaSuccess();
    });
  }

  userShow() {
    this.UploadPicStatus = false;
    this.SwalShowUser.show();
  }

  infoShow() {
    this.SwalShowInfo.show();
  }

  confirmAddArea() {
    if (this.formAddArea.status === "VALID") {
      // console.log(this.formAddArea);
      this.SwalFormAddArea.nativeSwal.close();
      this.loadingAddArea(1500);
    } else {
    }
  }

  alertAddAreaSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "บันทึกข้อมูลสำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      this.ClearDrag();
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

  cancelAddArea() {
    this.pathsPolygon = [];
    this.pathsPolyline = [];
    this.distanceArea = 0;
    this.addAreaStatus = false;
    this.SwalFormAddArea.nativeSwal.close();
    this.polygon.setMap(null);
  }

  showPolyArea(items) {
    this.editStatus = false;
    this.dataShowArea = items;
    this.FormEditAreaControl(this.dataShowArea);
    this.tasks.getAllTasks(this.dataShowArea._id);
    this.SwalShowAddArea.show();
    // console.log(this.dataShowArea);
  }

  closeShowArea() {
    if (this.typeSelectAreaPoly === 1) {
      this.SwalListArea.show();
    }
    this.FormEditAreaControl(this.dataShowArea);
    this.addAreaStatus = false;
  }

  confirmDeleteArea() {
    Swal.fire({
      title: "ยืนยันการลบแปลงพื้นที่?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "กำลังลบพื้นที่..",
          width: 300,
          animation: false,
          timer: 1500,
          customClass: {
            popup: "animated tada"
          },
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        }).then(result => {
          this.area.deleteArea(this.dataShowArea._id);
          Swal.fire({
            position: "center",
            type: "success",
            title: "remove succesfully",
            showConfirmButton: false,
            timer: 1500
          }).then(res => {});
        });
      }
    });
  }

  cancelEditArea() {
    this.editStatus = false;
    this.FormEditAreaControl(this.dataShowArea);
  }

  confirmEditArea() {
    Swal.fire({
      title: "ยืนยันการแก้ไข?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "กำลังอัพเดตข้อมูล..",
          width: 300,
          animation: false,
          timer: 1500,
          customClass: {
            popup: "animated tada"
          },
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        }).then(result => {
          this.area.updateArea(this.dataShowArea._id, this.formEditArea.value);
          this.alertEditSuccess();
        });
      }
    });
  }

  alertEditSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "อัพเดตข้อมูลสำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      this.editStatus = false;
      this.SwalShowAddArea.show();
    });
  }

  showTaskArea() {
    this.FormEditAreaControl(this.dataShowArea);
    this.editStatus = false;
    this.SwalTaskArea.show();
  }

  showDetailTask(i) {
    this.dataShowTask = this.tasks.listTasksArea[i];
    this.FormEditTaskControl(this.dataShowTask);
    this.SwalDetailTask.show();
  }

  DetailTaskClose() {
    this.editTaskStatus = false;
    this.SwalTaskArea.show();
  }

  CloseTaskArea() {
    this.SwalShowAddArea.show();
    this.editStatus = false;
  }

  cancelEditTask() {
    this.editTaskStatus = false;
    this.FormEditTaskControl(this.dataShowTask);
  }

  showAddTask() {
    this.formAddTask.patchValue({
      doDate: null,
      title: null,
      detail: null,
      status: "wait"
    });

    this.SwalAddTask.show();
  }

  AddTaskClose() {
    this.SwalTaskArea.show();
  }

  confirmAddTask() {
    //console.log(this.formAddTask);

    if (this.formAddTask.status === "VALID") {
      // console.log(this.formAddArea);
      this.loadingTask(1500);
      this.SwalFormAddArea.nativeSwal.clickCancel();
    } else {
    }
  }

  cancelAddTask() {
    this.SwalAddTask.nativeSwal.close();
  }

  loadingTask(time) {
    Swal.fire({
      title: "กำลังบันทึกข้อมูล..",
      width: 300,
      animation: false,
      timer: time,
      customClass: {
        popup: "animated tada"
      },
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    }).then(result => {
      this.tasks.addTask(this.formAddTask.value, this.dataShowArea._id);

      this.alertAddTaskSuccess();
    });
  }

  alertAddTaskSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "บันทึกข้อมูลสำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      this.SwalTaskArea.show();
    });
  }

  confirmDeleteTask() {
    Swal.fire({
      title: "ยืนยันกาลบงาน?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "กำลังบันทึกข้อมูล..",
          width: 300,
          animation: false,
          timer: 1500,
          customClass: {
            popup: "animated tada"
          },
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        }).then(result => {
          this.tasks.deleteTask(this.dataShowTask._id, this.dataShowArea._id);
          this.SwalTaskArea.show();
        });
      } else {
        this.SwalTaskArea.show();
      }
    });
  }

  confirmEditTask() {
    Swal.fire({
      title: "ยืนยันการแก้ไข?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "กำลังอัพเดตข้อมูล..",
          width: 300,
          animation: false,
          timer: 1500,
          customClass: {
            popup: "animated tada"
          },
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        }).then(result => {
          this.tasks.updateTask(
            this.dataShowTask._id,
            this.formEditTask.value,
            this.dataShowArea._id
          );
          this.alertEditTaskSuccess();
        });
      }
    });
  }

  alertEditTaskSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "อัพเดตข้อมูลสำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      this.editTaskStatus = false;
      this.SwalTaskArea.show();
    });
  }

  showSearchArea() {
    this.formSearch.patchValue({
      idArea: null
    });
    this.SwalSearchArea.show();
  }

  SubmitSearchArea() {
    if (this.formSearch.valid === true) {
      var check = false;
      var k = 0;
      for (var i = 0; i < this.area.listAreaUser.length; i++) {
        if (this.formSearch.value.idArea === this.area.listAreaUser[i].idArea) {
          k = i;
          check = true;
        }

        if (check === true) {
          Swal.fire({
            title: "ค้นหาแปลง..",
            width: 300,
            animation: true,
            timer: 2000,
            customClass: {
              popup: "animated tada"
            },
            onBeforeOpen: () => {
              Swal.showLoading();
            }
          }).then(result => {
            this.zoom = 16;
            this.latitude = this.area.listAreaUser[k].centerMarker[0].lat;
            this.longitude = this.area.listAreaUser[k].centerMarker[0].lng;
            this.zoom = 17;
          });
        } else {
          Swal.fire({
            position: "center",
            type: "error",
            width: 300,
            title: "ไม่มีแปลงที่ค้นหา!",
            showConfirmButton: false,
            timer: 1500
          }).then(result => {
            this.SwalSearchArea.show();
          });
        }
      }
    }
  }

  showListArea() {
    this.typeSelectAreaPoly = 1;

    this.formSearchListArea.patchValue({
      text: [null],
      type: "id"
    });

    this.AreaFilter = { nameArea: "", idArea: "", statusCut: "", typeArea: "" };

    this.dataSearchArea = this.area.listAreaUser;
    this.SwalListArea.show();
  }

  showChoosetypeMap() {
    this.SwalChooseTypeArea.show();
  }

  showInfomationArea() {
    this.CalInfomationArea();
    this.SwalInfomationArea.show();
  }

  doLogout() {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      type: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then(result => {
      if (result.value) {
        this.http.get<any>(environment.API_URL + `api/auth/logout`).subscribe(
          result => {
            this.alertLogoutSuccess();
          },
          error => {
            this.alertLooutError();
          },
          () => {}
        );
      }
    });
  }

  alertLogoutSuccess() {
    Swal.fire({
      position: "center",
      type: "success",
      title: "Logout Successfully",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      this.auth.logout();
    });
  }

  alertLooutError() {
    Swal.fire({
      customClass: {
        title: "text-red-500"
      },
      position: "center",
      type: "error",
      title: "Logout Fail",
      showConfirmButton: false,
      timer: 1500
    });
  }

  fileChangeEvent(event) {
    this.selectFileImage = event.target.files[0];

    console.log(this.selectFileImage);
  }

  uploadImage() {
    if (this.selectFileImage != null) {
      const formData = new FormData();
      formData.append("file", this.selectFileImage);

      this.http
        .post<any>(environment.API_URL + `api/auth/upload/userpic`, formData)
        .subscribe(
          result => {
            //console.log(result['fileUrl']);
            this.alertUploadSuccess(result["fileUrl"]);
          },
          error => {
            //console.log(error);
            this.alertUploadError();
          },
          () => {}
        );
    } else {
      // console.log(this.selectFileImage);
    }
  }

  loadingAlert() {
    Swal.fire({
      title: "กำลังอัพโหลด..",
      allowOutsideClick: false,
      width: 300,
      timer: 1500,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    }).then(result => {
      this.uploadImage();
    });
  }

  alertUploadSuccess(url) {
    Swal.fire({
      position: "center",
      type: "success",
      width: 300,
      title: "อัพโหลดรูปสำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    }).then(result => {
      let data = {
        urlImage: url
      };

      this.auth.updateUser(data);
      this.imageUser = url;
      this.userImage = url;
      console.log(this.imageUser);
      console.log(this.userImage);

      this.selectFileImage = null;
      this.formUpload.setValue({ file: null });

      this.SwalShowUser.show();
    });
  }

  alertUploadError() {
    Swal.fire({
      position: "center",
      width: 300,
      type: "error",
      title: "อัพโหลดรูปไม่สำเร็จ!",
      showConfirmButton: false,
      timer: 1500
    });
  }

  showImageFull() {
    console.log("asd");
    this.SwalShowImageFull.show();
  }

  searchChange(item) {
    console.log(item);
    this.SwalListArea.nativeSwal.close();

    this.formSearch.patchValue({
      idArea: item.idArea
    });

    this.SubmitSearchArea();
  }

  inputSearch(event) {
    console.log(this.formSearchListArea);

    if (this.formSearchListArea.value.type === "id") {
      this.AreaFilter = {
        nameArea: "",
        idArea: this.formSearchListArea.value.text,
        statusCut: "",
        typeArea: ""
      };
    } else if (this.formSearchListArea.value.type === "name") {
      this.AreaFilter = {
        nameArea: this.formSearchListArea.value.text,
        idArea: "",
        statusCut: "",
        typeArea: ""
      };
    } else if (this.formSearchListArea.value.type === "cut") {
      this.AreaFilter = {
        nameArea: "",
        idArea: "",
        statusCut: "ตัดแล้ว",
        typeArea: ""
      };
      console.log("cut");
    } else if (this.formSearchListArea.value.type === "notcut") {
      this.AreaFilter = {
        nameArea: "",
        idArea: "",
        statusCut: "ยังไม่ตัด",
        typeArea: ""
      };
    } else if (this.formSearchListArea.value.type === "t1") {
      this.AreaFilter = {
        nameArea: "",
        idArea: "",
        statusCut: "",
        typeArea: 0
      };
    } else if (this.formSearchListArea.value.type === "t2") {
      this.AreaFilter = {
        nameArea: "",
        idArea: "",
        statusCut: "",
        typeArea: 1
      };
    } else if (this.formSearchListArea.value.type === "t3") {
      this.AreaFilter = {
        nameArea: "",
        idArea: "",
        statusCut: "",
        typeArea: 2
      };
    }

    console.log(this.formSearchListArea.value.type);
  }

  closeListArea() {
    this.typeSelectAreaPoly = 0;
  }

  CalInfomationArea() {
    this.InfomationArea = {
      AreaAllCount: 0,
      AreaAllDistance: 0,
      T1AllCount: 0,
      T1AllDistance: 0,
      T2AllCount: 0,
      T2AllDistance: 0,
      T3AllCount: 0,
      T3AllDistance: 0,
      CutAllCount: 0,
      CutAllDistance: 0,
      notCutAllCount: 0,
      notCutAllDistance: 0
    };

    this.InfomationArea.AreaAllCount = this.area.listAreaUser.length;

    for (let i = 0; i < this.area.listAreaUser.length; i++) {
      this.InfomationArea.AreaAllDistance += this.area.listAreaUser[
        i
      ].distancArea;

      if (this.area.listAreaUser[i].statusCut === "ตัดแล้ว") {
        this.InfomationArea.CutAllCount += 1;
        this.InfomationArea.CutAllDistance += this.area.listAreaUser[
          i
        ].distancArea;
      }

      if (this.area.listAreaUser[i].statusCut === "ยังไม่ตัด") {
        this.InfomationArea.notCutAllCount += 1;
        this.InfomationArea.notCutAllDistance += this.area.listAreaUser[
          i
        ].distancArea;
      }

      if (this.area.listAreaUser[i].typeArea === 0) {
        this.InfomationArea.T1AllCount += 1;
        this.InfomationArea.T1AllDistance += this.area.listAreaUser[
          i
        ].distancArea;
      }

      if (this.area.listAreaUser[i].typeArea === 1) {
        this.InfomationArea.T2AllCount += 1;
        this.InfomationArea.T2AllDistance += this.area.listAreaUser[
          i
        ].distancArea;
      }

      if (this.area.listAreaUser[i].typeArea === 2) {
        this.InfomationArea.T3AllCount += 1;
        this.InfomationArea.T3AllDistance += this.area.listAreaUser[
          i
        ].distancArea;
      }
    }

    this.InfomationArea.AreaAllDistance =
      this.InfomationArea.AreaAllDistance * 0.000625;
    this.InfomationArea.CutAllDistance =
      this.InfomationArea.CutAllDistance * 0.000625;
    this.InfomationArea.notCutAllDistance =
      this.InfomationArea.notCutAllDistance * 0.000625;
    this.InfomationArea.T1AllDistance =
      this.InfomationArea.T1AllDistance * 0.000625;
    this.InfomationArea.T2AllDistance =
      this.InfomationArea.T2AllDistance * 0.000625;
    this.InfomationArea.T3AllDistance =
      this.InfomationArea.T3AllDistance * 0.000625;
  }
}
