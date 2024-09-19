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
import { ToastrService } from 'ngx-toastr';
import { environment } from "../createhelpinho/environments";

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
    private apiUrl = environment.apiUrl

    public steps = ['Categoria do helpinho', 'Conhecendo o helpinho', 'Metas do helpinho', 'Revisando'];
    public valores = [5000, 1000, 2000, 100000, 200000];
    public categorias = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];

    form: FormGroup;
    submitted = false;

    loggedUser: any;
    previewContent: string = '';
    user: any[] = [];  
    category: string = '';
    meta: any = 0;
    currency: string = ''

    constructor(private http: HttpClient, private authService: AuthService, private helpinhoService: LandingService, private router: Router, private toastr: ToastrService,

        private fb: FormBuilder) {
            this.form = this.fb.group({
                titulo: ['', [Validators.required, Validators.minLength(3)]],
                descricao: ['', [Validators.required, Validators.minLength(10)]],
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
        <div class="m-5 ">
            <h1 class="text-2xl font-bold mb-2">${this.form.value.titulo}</h1>
            <p class="text-gray-700">Descrição: ${this.form.value.descricao}</p>
            <span class="inline-block bg-blue-200 text-blue-800 text-sm font-semibold mt-2 px-2.5 py-0.5 rounded-full">Categoria: ${this.category}</span>
        </div>`;
    }

    selectCategory(category: any) {
        this.category = category
        this.form.value.categoria = category
    }

    selectValues(values: any) {
        this.meta = values
        this.form.value.meta = values

    }

    async onSubmit(): Promise<void> {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        if (this.form.valid) {
        
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken()}`
            });
            
            this.form.value.solicitante_id = this.user[0].id
            this.form.value.categoria = this.category
            this.form.value.meta = this.meta
            if(this.form.value.meta == 0) {
                this.toastr.error('Meta deve ser um valor diferente de R$ 0,00');
                return
            }
            try {
                this.http.post(`${this.apiUrl}/helpinho/solicitation/create`, this.form.value, { headers }).subscribe(
                    (response) => {
                        if(response) {
                            this.toastr.success('Solicitação de helpinho feita com sucesso!');
                            this.router.navigate(['/home']);
                        }
                    },
                    (error) => {
                        this.toastr.error(error.error.message);

                    }
                )
            } catch (error) {
                console.error(error);
            }
        }
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
                if(error.status == 401) {
                    this.authService.logout()
                }
                console.error(error);
            }
        );
    }

}

   