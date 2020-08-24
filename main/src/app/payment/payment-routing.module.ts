import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentCenterComponent } from './payment-center/payment-center.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { PaymentInvoiceComponent } from './payment-invoice/payment-invoice.component';
import { DeliveryAddressResolverService } from './delivery-address-resolver.service';
import { UserGuard } from '../auth/user.guard';
import { PaymentGuard } from './payment.guard';


const routes: Routes = [
  {
    path: '', component: PaymentCenterComponent,
    canActivateChild: [UserGuard],
    children: [
      {
        path: '',
        component: DeliveryAddressComponent,
        canActivate: [PaymentGuard],
        resolve: {
          addr: DeliveryAddressResolverService
        }
      },
      { path: 'option', component: PaymentOptionComponent, canActivate: [PaymentGuard] },
      { path: 'invoice', component: PaymentInvoiceComponent },
      { path: 'order', component: OrderStatusComponent, canActivate: [PaymentGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule { }
