import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterModule, FormsModule, NgxMaskDirective, NgxMaskPipe,ReactiveFormsModule, HttpClientModule],
  providers: [ provideNgxMask(),]
})
export class RegisterComponent {
  form: FormGroup;
  mask: string = '000.000.000-00';
  submitted = false;
  constructor( 
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      data_nascimento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    },{
     // validator: this.mustMatch('password', 'confirm_password')  // Validador personalizado para confirmar senhas
    });
  }
  mustMatch(password: string, confirm_password: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirm_password];

      if (confirmPassControl && confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        return;
      }

      if (passControl && passControl.value !== confirmPassControl && confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

    onSubmit() {
      
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      if (this.form.valid) {
        this.http.post('http://localhost:3000/dev/user/register', this.form.value)
          .subscribe({
            next: (response) => {
              if(response) {
                this.router.navigate(['login'])
              }
            },
            error: (error) => {
              console.error('Erro no registro', error);
            }
          });
        }
      }
    }
