import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './front_end/pages/home/home.component';
import { AboutComponent } from './front_end/pages/about/about.component';
import { ServiceComponent } from './front_end/pages/service/service.component';
import { ContactComponent } from './front_end/pages/contact/contact.component';
import { DonateComponent } from './front_end/pages/donate/donate.component';
import { GalleryComponent } from './front_end/pages/gallery/gallery.component';
import { EventComponent } from './front_end/Events/event/event.component';
import { TeamComponent } from './front_end/pages/team/team.component';
//import { JoinComponent } from './front_end/pages/join/join.component';
import { SignupComponent } from './front_end/pages/signup/signup.component';
import { ForgetPasswordComponent } from './front_end/pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './front_end/pages/reset-password/reset-password.component';
import { DashboardComponent } from './back_end/dashboard/dashboard.component';
import { AjoutEventComponent } from './front_end/Events/ajout-event/ajout-event.component';
import { EditEventComponent } from './front_end/Events/edit-event/edit-event.component';
import { EventDetailsComponent } from './front_end/Events/event-details/event-details.component';
import { EventPageComponent } from './front_end/Events/event-page/event-page.component';
import { AssociationComponent } from './front_end/association/association.component';
import { AssociationFormComponent } from 'src/app/front_end/association/association-form.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AjoutDonationComponent } from './front_end/donations/ajout-donation/ajout-donation.component';
import { DonationDetailsComponent } from './front_end/donations/donation-details/donation-details.component';


import { ListDonationComponent } from './front_end/donations/list-donation/list-donation.component';
import { AddPaymentComponent } from './front_end/payments/ajout-payment/ajout-payment.component';
import { MaterialDonationComponent } from './front_end/donations/material-donation/material-donation.component';
import { MaterialDonationListComponent } from './front_end/donations/material-donation-list/material-donation-list.component';
import { PaymentHistoryComponent } from './front_end/payments/payment-history/payment-history.component';



const routes: Routes = [

  // Route pour la page d'accueil
 // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'singin', component: LoginComponent },
  { path: '', component: HomeComponent },

  // Routes pour les autres pages
  { path: 'about', component: AboutComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'event', component: EventComponent },
  { path: 'team', component: TeamComponent },
 // { path: 'join', component: JoinComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget', component: ForgetPasswordComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'dash', component: DashboardComponent ,canActivate: [AuthGuard] },  
  { path: 'ajout-event', component: AjoutEventComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'event-details/:id', component: EventDetailsComponent },
  { path : 'list-event' , component : EventPageComponent},
  { path: 'associations', component: AssociationComponent },
  { path: 'associations/create', component: AssociationFormComponent },
{ path: 'associations/:id/edit', component: AssociationFormComponent },
{path : 'ajout-donation', component: AjoutDonationComponent },
{path: 'donation-details/:id', component: DonationDetailsComponent },
{path:'list-donation' , component : ListDonationComponent},

{path:'ajout-payment' , component : AddPaymentComponent},
{path:'material-donation' , component : MaterialDonationComponent},
{ path: 'payment-history', component: PaymentHistoryComponent },
{path:'material-donation-list' , component : MaterialDonationListComponent},

{ path: '**', redirectTo:"" , pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
