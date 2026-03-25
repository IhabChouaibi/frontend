import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, withInterceptors, provideHttpClient } from '@angular/common/http';
import { TruncatePipe } from './shared/utils/pipes/truncate-pipe';
import { DateFormatPipe } from './shared/utils/pipes/date-format-pipe';
import { FilterPipe } from './shared/utils/pipes/filter-pipe';
import { HasRole } from './shared/utils/directives/has-role';
import { Loading } from './shared/utils/directives/loading';
import { authInterceptor } from './core/interceptors/auth-interceptor-interceptor';
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
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, 
  ],
  providers: [
     provideHttpClient(withInterceptors([authInterceptor])),

  ],

  bootstrap: [App]
})
export class AppModule { }
