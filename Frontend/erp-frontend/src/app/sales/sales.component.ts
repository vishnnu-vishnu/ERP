import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  orders: Order[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listOrders();
    
  }


  listOrders(): void {
    this.productService.ListOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);


      }
    );
  }

  invoice(orderId: number): void {
    this.productService.DownloadInvoice(orderId).subscribe(
      (blob: Blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `invoice_order_${orderId}.pdf`;  
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      },
      (error) => {
        console.error('Invoice not downloaded:', error);
      }
    );
  }
  

 
}
