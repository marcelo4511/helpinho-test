import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class RegisterComponent {}  