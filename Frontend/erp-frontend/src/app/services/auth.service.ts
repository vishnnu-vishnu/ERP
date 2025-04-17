import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupUrl = 'http://127.0.0.1:8000/admin_app/register/'; 
  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(this.signupUrl, data);
  }
}