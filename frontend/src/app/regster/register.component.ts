import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { Router } from 'express';

@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterModule, FormsModule,     NgxMaskDirective] // Adicione aqui  ]
})
export class RegisterComponent {
    nome: string = '';
    email: string = '';
    data_nascimento: string = '';
    cpf: string = '';
    password: string = '';
    confirm_password: string = '';

    // constructor(
    //   private authService: AuthService,
    //   private router: Router
    // ) { }
    // submit() {
    
    //   this.authService.login(this.email, this.password).then(response => {
    //     this.router.navigate(['/login']);
    //   })
    //   .catch(error => {
    //    this.errorMessage = 'Falha no login. Verifique suas credenciais.';
    //     console.error(error);
    //   });
    // }
}  