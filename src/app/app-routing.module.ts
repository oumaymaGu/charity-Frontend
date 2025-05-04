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
import { InscriptionComponent } from './inscription/inscription.component';
import { AjoutLogistiqueComponent } from './back_end/LOG/ajoutlogestique/ajoutlogestique.component';
import { ListelogestiqueComponent } from './back_end/LOG/listelogestique/listelogestique.component';
import { EditlogestiqueComponent } from './back_end/LOG/editlogestique/editlogestique.component';
import { ListInscriptionComponent } from './back_end/list-inscription/list-inscription.component';
import { map } from 'leaflet';
import { MapComponent } from './front_end/map/map.component';
import { AjoutDonationComponent } from './front_end/donations/ajout-donation/ajout-donation.component';
import { DonationDetailsComponent } from './front_end/donations/donation-details/donation-details.component';
import { PaymentInscriptionComponent } from './front_end/payment-inscription/payment-inscription.component'; // Ensure this path is correct

import { ListDonationComponent } from './front_end/donations/list-donation/list-donation.component';
import { AddPaymentComponent } from './front_end/payments/ajout-payment/ajout-payment.component';
import { MaterialDonationComponent } from './front_end/donations/material-donation/material-donation.component';
import { MaterialDonationListComponent } from './front_end/donations/material-donation-list/material-donation-list.component';
import { PaymentHistoryComponent } from './front_end/payments/payment-history/payment-history.component';
import { StripeComponent } from './front_end/payments/stripe/stripe.component';
import { EventsLogestiquesComponent } from './back_end/LOG/events-logestiques/events-logestiques.component';
import { BilletComponent } from './front_end/billet/billet.component';
import { DonorContactComponent } from './front_end/donor-contact/donor-contact.component';
import { RequestListComponent } from './front_end/request-list/request-list.component';
import { NotificationComponent } from './front_end/notification/notification.component';
import { ScanMedicamentComponent } from './front_end/ocr/scan-medicament/scan-medicament.component';




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
{ path : 'ajout-log', component: AjoutLogistiqueComponent},
{ path : 'liste-log', component : ListelogestiqueComponent},
{ path : 'edit-log/:id', component : EditlogestiqueComponent},
{ path: 'inscription/:id', component: InscriptionComponent },
{ path: 'associations', component: AssociationComponent },
{ path: 'associations/create', component: AssociationFormComponent },
  { path : 'list-event' , component : EventPageComponent},
  { path: 'associations', component: AssociationComponent },
  { path: 'associations/create', component: AssociationFormComponent },
{ path: 'associations/:id/edit', component: AssociationFormComponent },
{ path: 'event/:eventId/users', component: ListInscriptionComponent },
{path: 'map', component: MapComponent},
{path : 'ajout-donation', component: AjoutDonationComponent },
{path: 'donation-details/:id', component: DonationDetailsComponent },
{path:'list-donation' , component : ListDonationComponent},


{path:'ajout-payment' , component : AddPaymentComponent},
{path:'material-donation' , component : MaterialDonationComponent},
{ path: 'payment-history', component: PaymentHistoryComponent },
{path:'material-donation-list' , component : MaterialDonationListComponent},
{ path: 'stripe-payment', component: StripeComponent },
{path: 'payment-inscription', component: PaymentInscriptionComponent },
{ path: 'events-logestiques', component: EventsLogestiquesComponent },
{ path: 'events-logestiques/:id', component: EventsLogestiquesComponent },
{ path: 'billet/:userId/:eventId', component: BilletComponent },
{ path: 'donor-contact/:id', component: DonorContactComponent },
{ path: 'Request-liste', component: RequestListComponent },

{ path: 'notifications', component: NotificationComponent },
{ path: 'scan', component: ScanMedicamentComponent },




{ path: '**', redirectTo:"" , pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
