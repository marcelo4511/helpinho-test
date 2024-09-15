import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule]
})
export class LandingComponent {
  form!: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    
    private authService: AuthService,
    private router: Router
  ) { }

  submit() {
    console.log(this.email)
    return
    this.authService.login(this.email, this.password)
      .then(response => {
        console.log('Login bem-sucedido!', response);
        this.router.navigate(['/login']);
        // Lógica de sucesso: armazenar token, redirecionar, etc.
      })
      .catch(error => {
        this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        console.error(error);
      });
  }
}  