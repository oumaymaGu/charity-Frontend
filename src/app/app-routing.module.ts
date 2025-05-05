import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './front_end/pages/home/home.component';
import { AboutComponent } from './front_end/pages/about/about.component';
import { ServiceComponent } from './front_end/pages/logement/log/log.component';
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
import { AjouterLogementComponent } from './back_end/logements/ajouter-logement/ajouter-logement.component';
import { ListeLogementComponent } from './back_end/logements/liste-logement/liste-logement.component';
import { ModifierLogementComponent } from './back_end/logements/modifier-logement/modifier-logement.component';
import { LogementComponent } from './front_end/pages/logement/logement.component';
import { LogementDetailsComponent } from './front_end/pages/logement/logement-details.component';
import { AddRefugeComponent } from './front_end/pages/refuges/add-refuge/add-refuge.component';
import { RefugeComponent } from './front_end/pages/refuges/refuge/refuge.component';
import { ListRefugeComponent } from './front_end/pages/refuges/list-refuge/list-refuge.component';
import { ModifierRefugeComponent } from './front_end/pages/refuges/modifier-refuge/modifier-refuge.component';
import { LastRefugeComponent } from './front_end/pages/refuges/last-refuge/last-refuge.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { AdminReservationsComponent } from './back_end/admin-reservations/admin-reservations.component';
import { NotificationsRefugeComponent } from './front_end/notifications-refuge/notifications-refuge.component';
import { ConnectionComponent } from './front_end/connection/connection.component';
import { PsychologicalTestComponent } from './front_end/pages/psychological-test/psychological-test/psychological-test.component';
import { PsychologicalTestResultsComponent } from './front_end/pages/psychological-test/psychological-test-results/psychological-test-results.component';







const routes: Routes = [

  // Route pour la page d'accueil
 // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signin', component: LoginComponent },
  { path: 'home', component: HomeComponent },

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
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dash', component: DashboardComponent ,canActivate: [AuthGuard] },  
  { path: 'ajout-event', component: AjoutEventComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'event-details/:id', component: EventDetailsComponent },
{ path : 'list-event' , component : EventPageComponent},
{ path: 'associations', component: AssociationComponent },
{ path: 'associations/create', component: AssociationFormComponent },
{ path: 'associations/:id/edit', component: AssociationFormComponent },
{ path: 'admin/logements/ajouter', component: AjouterLogementComponent },
{ path: 'admin/logements/liste', component: ListeLogementComponent },
{ path: 'admin/logements/modifier/:id', component: ModifierLogementComponent },
{ path: 'logement', component: LogementComponent },
{ path: 'logement-details/:id', component: LogementDetailsComponent },
{ path: 'refuge', component: RefugeComponent },
{ path: 'lastrefuge', component: LastRefugeComponent },
{ path: 'refuge/modifier/:idRfg', component: ModifierRefugeComponent },
{ path: 'listref', component: ListRefugeComponent },
{ path: 'addrefuge', component: AddRefugeComponent },
{ path: 'reservation/:username/:logementId', component: ReservationComponent },
{ path: 'admin/reservations', component: AdminReservationsComponent },
{ path: 'notificationRfg', component: NotificationsRefugeComponent },
{ path: '', component: ConnectionComponent },
{ path: 'psychological-test', component: PsychologicalTestComponent },
{ path: 'psychological-test-results', component: PsychologicalTestResultsComponent },





{ path: '**', redirectTo:"" , pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
