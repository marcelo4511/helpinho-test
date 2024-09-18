import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './regster/register.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { HelpinhoComponent } from './helpinho/helpinho.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HelpinhoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}