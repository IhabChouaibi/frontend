import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';
import { authInterceptor } from './core/interceptors/auth-interceptor-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { HrLayout } from './layouts/hr-layout/hr-layout';
import { EmployeeLayout } from './layouts/employee-layout/employee-layout';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [
    App,
    Login,
    HrLayout,
    EmployeeLayout,
    PublicLayout,
    ResetPassword
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }
