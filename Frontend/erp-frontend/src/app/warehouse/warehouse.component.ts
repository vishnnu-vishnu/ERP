import { Component, OnInit } from '@angular/core';
import { WarehouseService, Product } from '../services/warehouse.service';
import { MatSnackBar } from '@angular/material/snack-bar';



declare var bootstrap: any;

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  products: Product[] = [];
  newProduct: Partial<Product> = {
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock_quantity: 0
  };

  constructor(
    private warehouseService: WarehouseService
    ,private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    // this.snackBar.open('Snackbar Test', 'Dismiss', {
    //   duration: 3000,
    // });
    this.showLowStockAlert();
  }

  loadProducts(): void {
    this.warehouseService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  createProduct(): void {
    if (!this.newProduct.name || !this.newProduct.sku || !this.newProduct.category) {
      alert('Please fill all required fields');
      return;
    }

    this.warehouseService.createProduct(this.newProduct as Product).subscribe(
      (createdProduct) => {
        this.products.push(createdProduct);
        this.newProduct = {
          name: '',
          sku: '',
          category: '',
          price: 0,
          stock_quantity: 0
        };
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }

  selectedProduct: any = {};

  
  updateProduct(): void {
    const updatedProduct = {
      name: this.selectedProduct.name,
      sku: this.selectedProduct.sku,
      category: this.selectedProduct.category,
      price: this.selectedProduct.price,
      stock_quantity: this.selectedProduct.stock_quantity
    };
  
    this.warehouseService.updateProduct(this.selectedProduct.id, updatedProduct).subscribe(
      (updated) => {
        const index = this.products.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          this.products[index] = updated;
        }

        const modalElement = document.getElementById('staticBackdrop');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();

      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }
  
  openEditModal(product: any): void {
    this.selectedProduct = { ...product }; 
  }
  

  deleteProduct(id: number): void {
    this.warehouseService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== id);
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  showLowStockAlert(): void {
    this.warehouseService.lowStockAlert().subscribe(
      (data) => {
        console.log(data); 
        if (data && data.length > 0) {
          // Extract product names from the low stock data
          const productNames = data.map((product: any) => product.name).join(', ');
  
          // Show the snackbar with product names
          this.snackBar.open(`❗ Low Stock Alert! Products: ${productNames}`, 'Dismiss', {
            duration: 3000,
          });
        } else {
          // If no low stock products, show an informational message (optional)
          this.snackBar.open('📦 No low stock items found.', 'Dismiss', {
            duration: 3000,
          });
        }
      },
      (error) => {
        this.snackBar.open('❌ Error checking stock.', 'Dismiss', {
          duration: 3000,
        });
      }
    );
  }
  
}
