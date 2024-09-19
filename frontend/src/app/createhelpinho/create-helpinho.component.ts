import { CommonModule, DecimalPipe } from "@angular/common";
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LandingService } from "../landing/landing.service";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { environment } from "./environments";

@Component({
    selector: 'app-create-helpinho',
    templateUrl: './create-helpinho.component.html',
    standalone: true,
    imports: [DecimalPipe, FormsModule, CommonModule, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe,HttpClientModule,RouterModule],
    providers: [LandingService, provideNgxMask()]
})
export class createHelpinhoComponent {
    private apiUrl = environment.apiUrl

    public currentStep = 0;
    public steps = ['Categoria do helpinho', 'Conhecendo o helpinho', 'Metas do helpinho', 'Revisando'];
    public valores = [5000, 1000, 2000, 100000, 200000];
    public categorias = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];

    form: FormGroup;
    submitted = false;

    loggedUser: any;
    solicitation_helpinho: any = {};
    user: any[] = [];  
    constructor(private http: HttpClient, private authService: AuthService, private helpinhoService: LandingService,private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,

        private fb: FormBuilder) {
            this.form = this.fb.group({
                valor: ['', [Validators.required]],
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

    async onSubmit(): Promise<void> {

        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        if (this.form.valid) {

            const headers = new HttpHeaders({
                'Authorization': `Bearer ${this.authService.getToken()}`
            });
            this.form.value.doador_id = this.user[0].id
            this.form.value.solicitacao_id = this.route.snapshot.params["id"]

            try {
                this.http.post(`${this.apiUrl}/helpinho/create`, this.form.value, { headers }).subscribe(
                    (data) => {

                        if(data){
                            this.toastr.success('Parabéns! você ajudou o próximo!');
                            this.router.navigate(['/home'])
                        }
                    },
                )
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
    }

    logout() {    
        this.authService.logout()
    }

    async ngOnInit() {
        this.getAuthUser() 
 
        this.getSolicitacaoHelpinho(this.route.snapshot.params["id"]);

    }
    getSolicitacaoHelpinho(id: number) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
        this.http.get(`${this.apiUrl}/helpinho/solicitation/${id}`, {headers}).subscribe(
            (data) => {
                this.solicitation_helpinho = data;
            },
            (error) => {
                console.error(error);
            }
        );
    }
    
    
    getAuthUser() {
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

   