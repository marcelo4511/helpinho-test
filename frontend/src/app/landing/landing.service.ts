import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../createhelpinho/environments';

@Injectable({
    providedIn: 'root',
})
export class LandingService {
    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient,    private authService: AuthService,
    ) { }

    getHelpinhos(): Observable<any> {
        return this.http.get(`${this.apiUrl}/helpinhos/offline`, {  });
    }

    getuser(): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });

        return this.http.get(`${this.apiUrl}/user/loggeduser`, { headers });
    }
}