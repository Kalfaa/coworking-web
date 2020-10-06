import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ReservationComponent} from './reservation/reservation.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ReservationListComponent} from './reservation-list/reservation-list.component';
import {MyAccountComponent} from './my-account/my-account.component';
import {AddSubscriptionComponent} from './add-subscription/add-subscription.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'reservation-list', component: ReservationListComponent},
  { path: 'my-account', component: MyAccountComponent},
  { path: 'add-subscription', component: AddSubscriptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})



export class AppRoutingModule { }
