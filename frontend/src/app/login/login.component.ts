import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, RouterModule, FormsModule,ReactiveFormsModule],
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';
  submitted = false;
  passwordFieldType: string = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,

    private fb: FormBuilder) {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]      
    });
  }

  onSubmit() {
    this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      if (this.form.valid) {
        const {email, password} = this.form.value;

        this.authService.login(email, password).then(response => {
          if(response) {
            if(response && response.status == 500) {
              this.errorMessage = response.message
            }
            this.toastr.success('Bem vindo ao sistema!');
            this.router.navigate(['/home']);
          }
        })
      .catch(error => {
        this.errorMessage = 'Falha no login. Verifique suas credenciais.';
        console.error(error);
      });
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}  