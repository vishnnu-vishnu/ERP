import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://127.0.0.1:8000/admin_app/token/';  
  private token: string = '';

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: { username: string; password: string }): Observable<any> {
    const loginUrl = 'http://127.0.0.1:8000/admin_app/token/';  

    return this.http.post<any>(loginUrl, loginData);  
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
  
    try {
      const decoded: any = jwt_decode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      
      if (exp < now) {
        this.logout(); 
      }
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout(); 
      return false;
    }
  }
  

  getAuthToken(): string | null {
    return this.token;
  }

  logout(): void {
    localStorage.removeItem('access_token');  
    this.token = '';
    this.router.navigate(['/login']);  
  }
}
