import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr';
import { environment } from '../createhelpinho/environments';
@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterModule, FormsModule, NgxMaskDirective, NgxMaskPipe,ReactiveFormsModule, HttpClientModule],
  providers: [ provideNgxMask()]
})
export class RegisterComponent {
  form: FormGroup;
  mask: string = '000.000.000-00';
  errorMessage: string = '';
  submitted = false;
  private apiUrl = environment.apiUrl

  constructor( 
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,

    private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      data_nascimento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

    onSubmit() {
      
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      if (this.form.valid) {
        this.http.post(`${this.apiUrl}/user/register`, this.form.value)
          .subscribe({
            next: (response) => {
              if(response) {
                this.toastr.success('Parabéns! você está prestes a ajudar muitas pessoas!');
                this.router.navigate(['login'])
              }
            },
            error: (error) => {
              this.errorMessage = error.error.error
              console.error('Erro no registro', error);
            }
          });
        }
      }
    }
