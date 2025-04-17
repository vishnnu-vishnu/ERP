import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface salesstaff {
  id: number;
  username: string;
  email: string;
  role: string;
  
}


export interface Order {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  created_at: string;
  items: Array<{
    products: {
      id: number;
      name: string;
      sku: string;
      price: string;
      stock_quantity: number;
    };
    quantity: number;
  }>;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
private salesstaffapiUrl = 'http://127.0.0.1:8000/admin_app/sales_staff/';
private warehousestaffapiUrl = 'http://127.0.0.1:8000/admin_app/warehouse_staff/';
private orderlistapiUrl = 'http://127.0.0.1:8000/admin_app/list_order/';





  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getsalesstaff(): Observable<salesstaff[]> {
    return this.http.get<salesstaff[]>(this.salesstaffapiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getwarehousestaff(): Observable<salesstaff[]> {
    return this.http.get<salesstaff[]>(this.warehousestaffapiUrl, {
      headers: this.getAuthHeaders(),
    });
  }
  getorders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderlistapiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

}