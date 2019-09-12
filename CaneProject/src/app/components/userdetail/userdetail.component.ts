import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-userdetail",
  templateUrl: "./userdetail.component.html",
  styleUrls: ["./userdetail.component.css"]
})
export class UserdetailComponent implements OnInit {
  imageUser = "";
  selectFileImage = null;

  dataUser: any;

  formUpload: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.formUpload = this.fb.group({
      file: [null, Validators.required]
    });
    this.imageUser = this.auth.dataUserProfile.urlImage;
  }

  ngOnInit() {}

  fileChangeEvent(event) {
    this.selectFileImage = event.target.files[0];
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
        "urlImage": url
      };

      this.auth.updateUser(data);
      this.imageUser = url;
      
      this.selectFileImage = null;
      this.formUpload.setValue({ file: null });
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
}
