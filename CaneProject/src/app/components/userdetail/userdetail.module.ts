import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserdetailComponent } from './userdetail.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: UserdetailComponent},
    ]),
    ReactiveFormsModule
  ],
  declarations: [UserdetailComponent]
})
export class UserdetailModule { }
