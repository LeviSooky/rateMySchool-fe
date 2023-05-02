import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./page/login/login.component";
import {AuthGuard} from "./shared/model/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',
    loadChildren: () => import('./page/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: 'teachers',
    loadChildren: () => import('./page/teacher/teachers.module').then(m => m.TeachersModule)
  },
  { path: 'schools',
    loadChildren: () => import('./page/schools/schools.module').then(m => m.SchoolsModule)
  },
  { path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./page/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**', redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
