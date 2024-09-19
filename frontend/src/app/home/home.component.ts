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
  searchControl = new FormControl('');
  selectedCategory: string = '';
  searchTerm: string = '';
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

  filtrarHelpinhos(searchTerm: string | null): void {
    this.helpinhosFiltrados = this.helpinhos.filter(
      (helpinho) =>
        (helpinho.descricao.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          helpinho.titulo.toLowerCase().includes(searchTerm?.toLowerCase())) &&
        helpinho.solicitante_id !== this.user[0].id
    );
  }

  getHelpinhos() {
    this.helpinhoService.getHelpinhos().subscribe(
      (data) => {
        this.helpinhos = data.helpinhos;
        this.helpinhosFiltrados = this.helpinhos.filter(
          (helpinho) => helpinho.solicitante_id != this.user[0].id
        );
        this.searchControl.valueChanges.subscribe((searchTerm) => {
          this.filtrarHelpinhos(searchTerm);
        });
        console.log(this.user[0].id);
      },

      (error) => {
        console.error('Erro ao buscar helpinhos:', error);
      }
    );
  }

  filterHelpinhos() {
    this.helpinhosFiltrados = this.helpinhos.filter((helpinho) => {
      const matchesCategory = this.selectedCategory
        ? helpinho.categoria === this.selectedCategory
        : true;
      const matchesSearchTerm = this.searchTerm
        ? helpinho.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          helpinho.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        : true;

      return matchesCategory && matchesSearchTerm;
    });
  }
}
