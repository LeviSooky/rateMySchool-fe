import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./page/login/login.component";

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
    loadChildren: () => import('./page/admin/admin.module').then(m => m.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
