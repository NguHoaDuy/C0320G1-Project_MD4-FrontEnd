import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentCenterComponent } from './payment-center/payment-center.component';
import { combineLatest } from 'rxjs';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';

const routes: Routes = [
  {
    // path: "",
    // component: OrderStatusComponent,
    path: '',
    component: PaymentCenterComponent,
    children: [
      // { path: "", component: DeliveryAddressComponent },
      { path: 'order', component: OrderStatusComponent },
      { path: 'option', component: PaymentOptionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
