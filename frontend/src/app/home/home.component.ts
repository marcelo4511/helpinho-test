import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LandingService } from '../landing/landing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  providers: [LandingService],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
})

export class HomeComponent {
    isOpen = false;
    helpinhos: any[] = [];  // Array para armazenar os helpinhos

    constructor(
      private helpinhoService: LandingService,
      
    ) { }
  
    ngOnInit() {
      this.getHelpinhos();
    }
  
    // Método para consumir o serviço e pegar os helpinhos
    getHelpinhos() {
      this.helpinhoService.getHelpinhos().subscribe(
        (data) => {
          this.helpinhos = data.helpinhos;
        },
        (error) => {
          console.error('Erro ao buscar helpinhos:', error);
        }
      );
    }
}