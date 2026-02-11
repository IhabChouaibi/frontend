import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient ,withInterceptors} from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';
import { ReactiveFormsModule } from '@angular/forms';
import { Test } from './pages/test/test';
import { authInterceptor } from './interceptors/auth-interceptor-interceptor';

@NgModule({
  declarations: [
    App,
    Login,
    ResetPassword,
    Test
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
        ReactiveFormsModule,
        
  ],
  providers: [
        provideHttpClient(
    withInterceptors([authInterceptor])
  )
  ],
  bootstrap: [App]
})
export class AppModule { }
