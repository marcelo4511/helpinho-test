import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { LandingService } from "../landing/landing.service";
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localePt, 'pt-BR', localePtExtra);
@Component({
    selector: 'app-helpinho',
    templateUrl: './helpinho.component.html',
    standalone: true,
    imports: [DecimalPipe, FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
    providers: [LandingService, CurrencyPipe, { provide: LOCALE_ID, useValue: 'pt-BR' }]

})
export class HelpinhoComponent {
    public currentStep = 0;
    
    public steps = ['Categoria do helpinho', 'Conhecendo o helpinho', 'Metas do helpinho', 'Revisando'];
    public valores = [5000, 1000, 2000, 100000, 200000];
    public categorias = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];

    form: FormGroup;
    submitted = false;
    
    titulo: string = '';
    descricao: string = '';
    image: File | null = null;
    loggedUser: any;
    previewContent: string = '';
    user: any[] = [];  

    constructor(private http: HttpClient, private authService: AuthService, private helpinhoService: LandingService,
        private fb: FormBuilder) {
            this.form = this.fb.group({
                titulo: ['', [Validators.required, Validators.minLength(3)]],
                descricao: ['', [Validators.required, Validators.email]],
                image: ['', [Validators.required]],
            }) 
        } 
    
  
    setStep(index: number) {
        this.currentStep = index;
    }
  
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }
  
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    onFileSelected(event: any): void {
        this.form.value.image = event.target.files[0];
    }

    updatePreview(): void {
        this.previewContent = `
         <h1 class="text-2xl font-bold mb-2">${this.form.value.titulo}</h1>
            <p class="text-gray-700">Descrição${this.form.value.descricao}</p>
            <span class="inline-block bg-blue-200 text-blue-800 text-sm font-semibold mt-2 px-2.5 py-0.5 rounded-full">Meta: ${this.form.value.meta}</span>
            <span class="inline-block bg-blue-200 text-blue-800 text-sm font-semibold mt-2 px-2.5 py-0.5 rounded-full">Categoria: ${this.form.value.meta}</span>
        `;
    }

    async onSubmit(): Promise<void> {
        this.submitted = true;
        // if (this.form.invalid) {
        //     return;
        // }
        //if (this.form.valid) {

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
            
            const formData = new FormData();
            formData.append('titulo', this.form.value.titulo);
            formData.append('descricao', this.form.value.descricao);
            formData.append('imagem', this.form.value.image);
            formData.append('meta', this.form.value.descricao);
            formData.append('solicitante', '1')
            try {
                this.http.post('http://localhost:3000/dev/helpinho/solicitation/create', formData, { headers }).subscribe(
                    (data) => {
                        console.log(data)
                    },
                )
                // if (!response.ok) {
                //     throw new Error('Network response was not ok ' + response.statusText);
                // }
          
                //const result =  response.json();
            } catch (error) {
                console.error('Error:', error);
            }
    
            console.log('Formulário enviado:', formData);
       // }
    }

    logout() {    
        this.authService.logout()
    }

    async ngOnInit() {
        this.getuser()  
    }

    getuser() {
        this.helpinhoService.getuser().subscribe(
            (data) => {
                this.user = data.users;
            },
            (error) => {
                console.error('Erro ao buscar helpinhos:', error);
            }
        );
    }

}

   