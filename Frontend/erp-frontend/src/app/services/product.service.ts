import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category:string;
  price: number;
  stock_quantity: number;
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
export class ProductService {

  private apiUrl = 'http://127.0.0.1:8000/sales/products/';
  private orderapiurl='http://127.0.0.1:8000/sales/order/';
  private orderlisturl='http://127.0.0.1:8000/sales/listorders/';
  private invoiceapiurl='http://127.0.0.1:8000/sales/invoice/'

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(this.orderapiurl, orderData, {
      headers: this.getAuthHeaders(),
    });
  }

  ListOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderlisturl, {
      headers: this.getAuthHeaders(),
    });
  }

  DownloadInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.invoiceapiurl}${orderId}/`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }

  
}
