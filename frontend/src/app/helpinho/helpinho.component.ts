import { DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'app-helpinho',
    templateUrl: './helpinho.component.html',
    standalone: true,
    imports: [DecimalPipe]
})
export class HelpinhoComponent {
    public currentStep = 0;
    
    public steps = ['Categoria do helpinho', 'Conhecendo o helpinho', 'Metas do helpinho', 'Revisando'];
    public valores = [5000, 1000, 2000, 100000, 200000];
    public categorias = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];
    public formData = {
        name: '',
        email: '',
        address: '',
        city: ''
    };

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
}  