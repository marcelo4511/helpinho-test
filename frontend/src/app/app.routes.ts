import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './regster/register.component';
import { HomeComponent } from './home/home.component';
import { HelpinhoComponent } from './helpinho/helpinho.component';
import { AuthGuard } from './auth.guard';
import { LandingComponent } from './landing/landing.component';
import { NgModule } from '@angular/core';


NgModule({
    imports: [RouterModule],
    exports: [RouterModule]
})

export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'helpinho', component: HelpinhoComponent, canActivate: [AuthGuard]}
];
