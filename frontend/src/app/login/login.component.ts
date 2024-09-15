import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, RouterModule]
})
export class LoginComponent {
  form!: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  submit() {
    
    this.authService.login(this.email, this.password).then(response => {
      this.router.navigate(['/home']);
    })
    .catch(error => {
      this.errorMessage = 'Falha no login. Verifique suas credenciais.';
      console.error(error);
    });
  }
}  