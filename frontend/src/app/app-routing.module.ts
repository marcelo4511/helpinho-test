import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Certifique-se de que o componente está importado
import { RegisterComponent } from './regster/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, },  // Rota para a página de login
  { path: 'register', component: RegisterComponent, },  // Rota para a página de login

  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirecionamento para a rota padrão
  { path: '**', redirectTo: '/login' }  // Rota curinga para rotas inexistentes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}





