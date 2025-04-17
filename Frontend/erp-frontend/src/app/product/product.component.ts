import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product.service';

declare var bootstrap: any; 
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  orderQuantity: number = 1;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  openBuyModal(product: Product) {
    this.selectedProduct = product;
    this.orderQuantity = 1;

    const modalElement = document.getElementById('orderModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  calculateTotalAmount(): number {
    if (!this.selectedProduct || !this.orderQuantity) return 0;
  
    const price = parseFloat(this.selectedProduct.price.toString());
    return price * this.orderQuantity;
  }
  
  

 placeOrder() {
  const userId = this.getUserIdFromToken();

  if (!userId || !this.selectedProduct) {
    alert("User not authenticated or product not selected.");
    return;
  }

  const orderData = {
    user: userId,
    items: [
      {
        products: this.selectedProduct.id,  
        quantity: this.orderQuantity
      }
    ]
  };

  console.log('Placing order:', orderData);

  this.productService.placeOrder(orderData).subscribe(
    (response) => {
      alert('Order placed successfully!');
      const modalEl = document.getElementById('orderModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      this.loadProducts();
    },
    (error) => {
      console.error('Order failed:', error);
      alert('Failed to place order. Try again later.');
    }
  );
}


loadProducts(): void {
  this.productService.getProducts().subscribe((data) => {
    this.products = data;
  });
}

  
  

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch (e) {
      console.error('Failed to parse token:', e);
      return null;
    }
  }

  



}


