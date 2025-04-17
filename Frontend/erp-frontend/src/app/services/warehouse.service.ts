import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private apiUrl = 'http://127.0.0.1:8000/sales/products/';
  private lowapiurl='http://127.0.0.1:8000/inventory/products/low-stock';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}${id}/`, product, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  lowStockAlert(): Observable<any> {
    return this.http.get(this.lowapiurl, {
      headers: this.getAuthHeaders()
    });
  }
}
