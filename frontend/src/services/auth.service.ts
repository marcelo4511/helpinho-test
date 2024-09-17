import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserToken: string | null = null;
    private apiUrl = 'http://localhost:3000/dev/user/login';

    constructor(private router: Router) {
        if (this.isLocalStorageAvailable()) {
            this.currentUserToken = localStorage.getItem('authToken');
        }
    }
  
    login(email: string, password: string): Promise<any> {
           
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error('Erro na autenticação');
            }
            const data = await response.json();
            this.currentUserToken = data.token;
            if (this.isLocalStorageAvailable()) {
                localStorage.setItem('authToken', this.currentUserToken!);
            }
            return this.router.navigate(['/home']);
        })
        .catch(error => {
            console.error('Erro no login:', error);
            throw error;
        });
    }

    

    isLoggedIn(): boolean {
        return !!this.currentUserToken;
    }

    isLocalStorageAvailable(): boolean {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    logout(): void {
        if (this.isLocalStorageAvailable()) {
            localStorage.removeItem('authToken');
            this.currentUserToken = null;
            this.router.navigate(['/login']);
        }
    }

    async fetchWithAuth(url: string, options: any = {}): Promise<Response> {
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${this.currentUserToken}`,
        };
        return fetch(url, { ...options, headers });
    }

    // Método para obter o usuário logado
    async getLoggedUser(): Promise<void> {
        fetch('http://localhost:3000/dev/user/loggeduser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.isLocalStorageAvailable() ? `Bearer ${localStorage.getItem('authToken')}` : ''
            }
        })
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            return data
        })
        .catch(error => console.error('Erro ao obter usuário logado:', error));
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }
}