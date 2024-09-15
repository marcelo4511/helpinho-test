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
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    AppRoutingModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}