import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

    @Injectable({
        providedIn: 'root',
    })
export class LandingService {
    private apiUrl = 'http://localhost:3000/dev/helpinhos/offline'; // URL da API

    constructor(private http: HttpClient) { }

    // Método para pegar os helpinhos com autenticação via Bearer Token
    getHelpinhos(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'Authorization': `Bearer ${token}`
        // });

        return this.http.get(this.apiUrl, {  });
    }
}