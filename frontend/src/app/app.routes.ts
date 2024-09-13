import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './regster/register.component';
import { HomeComponent } from './home/home.component';
import { HelpinhoComponent } from './helpinho/helpinho.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent},
    {path: 'helpinho', component: HelpinhoComponent},

];
