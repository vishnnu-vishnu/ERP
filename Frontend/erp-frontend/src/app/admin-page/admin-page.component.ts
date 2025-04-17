import { Component, OnInit } from '@angular/core';
import { AdminService,salesstaff } from '../services/admin.service';
import {Order} from '../services/admin.service'

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  salestaffs:salesstaff[] = [];
  orders: Order[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadsalestaff();
    this.loadwarehousetaff

  }
  loadsalestaff():void{
    this.adminService.getsalesstaff().subscribe(
      (data)=>{
        this.salestaffs=data;
      },
      (error)=>{
        console.error('Error fetching salestaff:', error);
      }
    )
  }

  loadwarehousetaff():void{
    this.adminService.getwarehousestaff().subscribe(
      (data)=>{
        this.salestaffs=data;
      },
      (error)=>{
        console.error('Error fetching warehousetaff:', error);
      }
    )
  }

  loadorder():void{
    this.adminService.getorders().subscribe(
      (data)=>{
        this.orders=data;
      },
      (error)=>{
        console.error('Error fetching orders:', error);
      }
    )
  }

  getTotalPrice(item: any): number {
    return item.quantity * parseFloat(item.products.price);
  }
}


