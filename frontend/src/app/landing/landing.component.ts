import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingService } from './landing.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [LandingService]
})
export class LandingComponent {
  form!: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  helpinhos: any[] = []; 
  searchControl: string = '';
  selectedCategory: string = '';
  helpinhosFiltrados: any[] = [];

  filteredHelpinhos: any[] = [];
  categories = ['Jogos', 'Saude', 'Música', 'Reforma', 'Emergencia', 'Hospitalar'];
  constructor(
    private helpinhoService: LandingService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getHelpinhos();
  }
  

  getHelpinhos() {
    this.helpinhoService.getHelpinhosoffline().subscribe(
      (data) => {
          this.helpinhos = data.helpinhos;     
        },

      (error) => {
        console.error('Erro ao buscar helpinhos:', error);
      }
    );
  }

  filteredItems() {
    let filtered = this.helpinhos;

    // Filtro por título ou descrição
    if (this.searchControl) {
      const lowerCaseSearchTerm = this.searchControl.toLowerCase();
      filtered = filtered.filter(item =>
        item.titulo.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.descricao.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Filtro por categoria
    if (this.selectedCategory) {
        filtered = filtered.filter(item => item.categoria === this.selectedCategory);
    }
    
    return filtered;
    ;
  }
}  