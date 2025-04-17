import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { SalesComponent } from './sales/sales.component';



const routes: Routes = [
  { path: '',component:HomeComponent},
  { path: 'products', component: ProductComponent },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'sales', component: SalesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


