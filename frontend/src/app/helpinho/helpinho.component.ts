import { CommonModule, DecimalPipe } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: 'app-helpinho',
    templateUrl: './helpinho.component.html',
    standalone: true,
    imports: [DecimalPipe, FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class HelpinhoComponent {
    public currentStep = 0;
    
    public steps = ['Categoria do helpinho', 'Conhecendo o helpinho', 'Metas do helpinho', 'Revisando'];
    public valores = [5000, 1000, 2000, 100000, 200000];
    public categorias = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];
    title: string = '';
    description: string = '';
    image: File | null = null;

    constructor(private http: HttpClient) {
    
    }

    getBgColor(page: number) {
        console.log(page)
        return {
          'bg-pink-500': page === this.currentStep,
          'bg-gray-500': page !== this.currentStep
        };
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
        this.image = event.target.files[0];
    }

    async onSubmit(): Promise<void> {
        if (this.title && this.description && this.image) {
            const formData = new FormData();
            formData.append('titulo', this.title);
            formData.append('descricao', this.description);
            formData.append('imagem', this.image);
            formData.append('meta', this.description);
            formData.append('solicitacao_id', '1')

            // this.http.post('http://localhost:3000/dev/helpinho/create', formData).subscribe(response => {
            //     console.log('Formulário enviado com sucesso', response);
            // });

            try {
                const response = await fetch('http://localhost:3000/dev/helpinho/create', {
                    method: 'POST',
                    body: formData
                });
          
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
          
                const result =  response.json();
                console.log('Success:', result);
            } catch (error) {
                console.error('Error:', error);
            }
    
            console.log('Formulário enviado:', formData);
        }
    }
}  