import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LandingService } from '../landing/landing.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  providers: [LandingService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
  ],
})
export class HomeComponent {
  isOpen = false;
  helpinhos: any[] = [];
  helpinhosFiltrados: any[] = [];
  user: any[] = [];
  searchControl: string = '';
  selectedCategory: string = '';
  filteredHelpinhos: any[] = [];
  categories = [
    'Jogos',
    'Saude',
    'Música',
    'Reforma',
    'Emergencia',
    'Hospitalar',
  ];

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private helpinhoService: LandingService
  ) {}

  ngOnInit() {
    this.getuser();
    setTimeout(() => {
      this.getHelpinhos();
    }, 1000);
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Até breve');
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

  getHelpinhos() {
    this.helpinhoService.getHelpinhos().subscribe(
      (data) => {
        this.helpinhos = data.helpinhos;
      },
      (error) => {
        if(error.status == 401) {
          this.authService.logout()
        }
        console.error( error);
      }
    );
  }
}
