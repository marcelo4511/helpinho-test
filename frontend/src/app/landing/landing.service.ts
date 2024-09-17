import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

    @Injectable({
        providedIn: 'root',
    })
export class LandingService {
    private apiUrl = 'http://localhost:3000/dev/helpinhos/offline'; // URL da API

    constructor(private http: HttpClient,    private authService: AuthService,
    ) { }

    getHelpinhos(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'Authorization': `Bearer ${token}`
        // });

        return this.http.get(this.apiUrl, {  });
    }

    getuser(): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });

        return this.http.get('http://localhost:3000/dev/user/loggeduser', { headers });
    }
}