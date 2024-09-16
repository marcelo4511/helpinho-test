import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingService } from './landing.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [LandingService]
})
export class LandingComponent {
  form!: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  helpinhos: any[] = [];  // Array para armazenar os helpinhos

  constructor(
    private helpinhoService: LandingService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getHelpinhos();
  }

  // Método para consumir o serviço e pegar os helpinhos
  getHelpinhos() {
    this.helpinhoService.getHelpinhos().subscribe(
      (data) => {
        this.helpinhos = data.helpinhos;
      },
      (error) => {
        console.error('Erro ao buscar helpinhos:', error);
      }
    );
  }

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