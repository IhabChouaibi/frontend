import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { HrLayout } from './layouts/hr-layout/hr-layout';
import { AuthGuard } from './core/guards/auth-guard-guard';
import { EmployeeLayout } from './layouts/employee-layout/employee-layout';

const routes: Routes = [
  // ================= PUBLIC =================
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'reset-password',
        component: ResetPassword
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/public/public-module').then(m => m.PublicModule)
      }
    ]
  },

  // ================= HR =================
  {
    path: 'hr',
    component: HrLayout,
    canActivate: [AuthGuard],
    data: { roles: ['HR'] },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/hr/hr-module').then(m => m.HrModule)
      }
    ]
  },

  // ================= EMPLOYEE =================
  {
    path: 'employee',
    component: EmployeeLayout,
    canActivate: [AuthGuard],
    data: { roles: ['EMPLOYEE'] },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/employee/employee-module').then(m => m.EmployeeModule)
      }
    ]
  },
  // fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
