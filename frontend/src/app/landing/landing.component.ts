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
  searchControl = new FormControl('');
  selectedCategory: string = '';
  helpinhosFiltrados: any[] = [];

  searchTerm: string = '';
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
  

  filtrarHelpinhos(searchTerm: string | null): void {
    
  }

  getHelpinhos() {
    this.helpinhoService.getHelpinhos().subscribe(
      (data) => {
          this.helpinhos = data.helpinhos;
          this.searchControl.valueChanges.subscribe(searchTerm => {
            this.helpinhosFiltrados = this.helpinhos.filter(
              (helpinho) =>
                (helpinho.descricao.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                  helpinho.titulo.toLowerCase().includes(searchTerm?.toLowerCase()))
            );
          });        
        },

      (error) => {
        console.error('Erro ao buscar helpinhos:', error);
      }
    );
  }

  filterHelpinhos() {
    this.helpinhosFiltrados = this.helpinhos.filter(helpinho => {
      const matchesCategory = this.selectedCategory ? helpinho.categoria === this.selectedCategory : true;
      const matchesSearchTerm = this.searchTerm 
        ? helpinho.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          helpinho.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      
      return matchesCategory && matchesSearchTerm;
    });
  }
}  