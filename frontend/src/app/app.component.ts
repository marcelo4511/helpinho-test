import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DecimalPipe]
})
export class AppComponent {
  title = 'Helpinho';
}
