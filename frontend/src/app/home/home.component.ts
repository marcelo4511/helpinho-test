import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,

  imports: [RouterModule]
})

export class HomeComponent {
    isOpen = false;
}