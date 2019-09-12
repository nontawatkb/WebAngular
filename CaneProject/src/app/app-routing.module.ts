import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadChildren: './components/login/login.module#LoginModule' },
  { path: 'area', component: NavbarComponent, loadChildren: './components/areadetail/areadetail.module#AreadetailModule', canActivate: [AuthGuard] },
  { path: 'home', component: NavbarComponent, loadChildren: './components/home/home.module#HomeModule', canActivate: [AuthGuard] },
  { path: 'userdetail', component: NavbarComponent, loadChildren: './components/userdetail/userdetail.module#UserdetailModule', canActivate: [AuthGuard] },
  { path: 'contact', component: NavbarComponent, loadChildren: './components/contact/contact.module#ContactModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
