import { CommonModule, DecimalPipe } from "@angular/common";
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LandingService } from "../landing/landing.service";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-create-helpinho',
    templateUrl: './create-helpinho.component.html',
    standalone: true,
    imports: [DecimalPipe, FormsModule, CommonModule, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe,HttpClientModule,RouterModule],
    providers: [LandingService, provideNgxMask()]
})
export class createHelpinhoComponent {
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
    previewImageUrl: string | ArrayBuffer | null = '';

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

    onFileSelected(event: any): void {
        this.form.value.image = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.previewImageUrl = reader.result;
            console.log(this.previewImageUrl)
        };
  
    }

    updatePreview(): void {
        this.previewContent = `
            <h1>${this.form.value.titulo}</h1>
            <p>${this.form.value.descricao}</p>
            <img src="${this.form.value.image}" alt="Preview Image" style="max-width: 100%; height: auto;" />
        `;
      }

    async onSubmit(): Promise<void> {
        this.toastr.success('Até breve');

        console.log('aeee')
        this.submitted = true;
        // if (this.form.invalid) {
        //     return;
        // }
        //if (this.form.valid) {

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
            
            console.log('enre')
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
                //console.log('Success:', result);
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
        //this.getSolicitacaoHelpinho(this.route.snapshot.params["id"]);

    }
    getTutorial(id: string): void {
        // this.http.get(`${baseUrl}/${id}`);
        // .subscribe({
        //     next: (data) => {
        //     this.currentTutorial = data;
        //         console.log(data);
        //     },
        //     error: (e) => console.error(e)
        // });
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

   