import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreadetailComponent } from './areadetail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: AreadetailComponent}
    ]),
  ],
  declarations: [AreadetailComponent]
})
export class AreadetailModule { }
