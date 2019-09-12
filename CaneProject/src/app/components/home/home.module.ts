import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { defineLocale } from 'ngx-bootstrap/chronos';
import { deLocale, frLocale, plLocale, thLocale } from 'ngx-bootstrap/locale';
import { BrowserModule } from '@angular/platform-browser';
 defineLocale('de', deLocale);
 defineLocale('fr', frLocale);
 defineLocale('pl', plLocale);
 defineLocale('th', thLocale);

@NgModule({
  imports: [
    CommonModule,
    FilterPipeModule,
    FormsModule,
    NgxChartsModule,
    RouterModule.forChild([
      {path: '', component: HomeComponent}
    ]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC9PnuRk42kbCPMOvsfHpn40r5SoyN38zI',
      libraries: ['places', 'drawing', 'geometry'],
     // apiKey: 'AIzaSyCJEIcQRGxP6EPDK2zZAiNTAqp03aYnv9Q'
    }),
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
