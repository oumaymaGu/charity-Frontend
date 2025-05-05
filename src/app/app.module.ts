import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Front-end components
import { AboutComponent } from './front_end/pages/about/about.component';
import { HeaderComponent } from './front_end/header/header.component';
import { CarouselComponent } from './front_end/carousel/carousel.component';
import { BlogComponent } from './front_end/blog/blog.component';
import { FooterComponent } from './front_end/footer/footer.component';
import { TestimonialsComponent } from './front_end/testimonials/testimonials.component';
import { HomeComponent } from './front_end/pages/home/home.component';
import { ServiceComponent } from './front_end/pages/logement/log/log.component';
import { ContactComponent } from './front_end/pages/contact/contact.component';
import { DonateComponent } from './front_end/pages/donate/donate.component';
import { GalleryComponent } from './front_end/pages/gallery/gallery.component';
import { EventComponent } from './front_end/Events/event/event.component';
import { TeamComponent } from './front_end/pages/team/team.component';
import { SignupComponent } from './front_end/pages/signup/signup.component';
import { ForgetPasswordComponent } from './front_end/pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './front_end/pages/reset-password/reset-password.component';
import { AjoutEventComponent } from './front_end/Events/ajout-event/ajout-event.component';
import { EditEventComponent } from './front_end/Events/edit-event/edit-event.component';
import { EventPageComponent } from './front_end/Events/event-page/event-page.component';
import { EventDetailsComponent } from './front_end/Events/event-details/event-details.component';
import { AssociationComponent } from './front_end/association/association.component';
import { LogementComponent } from './front_end/pages/logement/logement.component';
import { LogementDetailsComponent } from './front_end/pages/logement/logement-details.component';
import { AddRefugeComponent } from './front_end/pages/refuges/add-refuge/add-refuge.component';
import { RefugeComponent } from './front_end/pages/refuges/refuge/refuge.component';
import { LastRefugeComponent } from './front_end/pages/refuges/last-refuge/last-refuge.component';
import { ListRefugeComponent } from './front_end/pages/refuges/list-refuge/list-refuge.component';
import { ModifierRefugeComponent } from './front_end/pages/refuges/modifier-refuge/modifier-refuge.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { NotificationsRefugeComponent } from './front_end/notifications-refuge/notifications-refuge.component';
import { ConnectionComponent } from './front_end/connection/connection.component';
import { PsychologicalTestComponent } from './front_end/pages/psychological-test/psychological-test/psychological-test.component';
import { PsychologicalTestResultsComponent } from './front_end/pages/psychological-test/psychological-test-results/psychological-test-results.component';
import { AssociationDetailComponent } from './front_end/pages/about/association-detail/association-detail.component';
import { ChatComponent } from './front_end/pages/components/chat/chat.component';
import { ChatAdminComponent } from './front_end/pages/chat-admin/chat-admin.component';
import { MapComponent } from './front_end/map/map.component';
import { AjoutDonationComponent } from './front_end/donations/ajout-donation/ajout-donation.component';
import { DonationDetailsComponent } from './front_end/donations/donation-details/donation-details.component';
import { ListDonationComponent } from './front_end/donations/list-donation/list-donation.component';
import { AddPaymentComponent } from './front_end/payments/ajout-payment/ajout-payment.component';
import { MaterialDonationComponent } from './front_end/donations/material-donation/material-donation.component';
import { MaterialDonationListComponent } from './front_end/donations/material-donation-list/material-donation-list.component';
import { PaymentHistoryComponent } from './front_end/payments/payment-history/payment-history.component';
import { StripeComponent } from './front_end/payments/stripe/stripe.component';
import { NotificationComponent } from './front_end/notification/notification.component';
import { ScanMedicamentComponent } from './front_end/ocr/scan-medicament/scan-medicament.component';
import { DonorContactComponent } from './front_end/donor-contact/donor-contact.component';
import { PaymentInscriptionComponent } from './front_end/payment-inscription/payment-inscription.component';
import { RequestListComponent } from './front_end/request-list/request-list.component';
import { BilletComponent } from './front_end/billet/billet.component';

// Back-end components
import { SidebarComponent } from './back_end/sidebar/sidebar.component';
import { NavbarComponent } from './back_end/navbar/navbar.component';
import { DashboardComponent } from './back_end/dashboard/dashboard.component';
import { AdminReservationsComponent } from './back_end/admin-reservations/admin-reservations.component';
import { AjouterAssociationComponent } from './back_end/associations/ajouter-association/ajouter-association.component';
import { ListAssociationComponent } from './back_end/associations/list-association/list-association.component';
import { ModifierAssociationComponent } from './back_end/associations/modifier-association/modifier-association.component';
import { AjoutStockComponent } from './back_end/stock/ajout-stock/ajout-stock.component';
import { ListStockComponent } from './back_end/stock/list-stock/list-stock.component';
import { ModifierStockComponent } from './back_end/stock/modifier-stock/modifier-stock.component';
import { StockRetraitComponent } from './back_end/stock/stock-retrait/stock-retrait.component';
import { AjoutLogistiqueComponent } from './back_end/LOG/ajoutlogestique/ajoutlogestique.component';
import { ListelogestiqueComponent } from './back_end/LOG/listelogestique/listelogestique.component';
import { EditlogestiqueComponent } from './back_end/LOG/editlogestique/editlogestique.component';
import { ListInscriptionComponent } from './back_end/list-inscription/list-inscription.component';
import { EventsLogestiquesComponent } from './back_end/LOG/events-logestiques/events-logestiques.component';

// Auth and user components
import { LoginComponent } from './login/login.component';
import { SingupuserComponent } from './singupuser/singupuser.component';
import { InscriptionComponent } from './inscription/inscription.component';

// Pipes
import { FilterByTypePipe } from 'src/filter-by-type.pipe';
import { MaskCardPipe } from './front_end/mask.pipe';
import { NotificationTypePipe } from './notification-type.pipe';

// Services & Interceptors
import { SseService } from './services/sse.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// External modules
import { ModalModule } from 'ngx-bootstrap/modal';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { QRCodeModule } from 'angularx-qrcode';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

// Modules
import { LogementsModule } from './back_end/logements/logements.module';
import { UserProfilComponent } from './front_end/user-profil/user-profil.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HeaderComponent,
    CarouselComponent,
    BlogComponent,
    FooterComponent,
    TestimonialsComponent,
    HomeComponent,
    ServiceComponent,
    ContactComponent,
    DonateComponent,
    GalleryComponent,
    EventComponent,
    TeamComponent,
    SignupComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    AjoutEventComponent,
    EditEventComponent,
    EventPageComponent,
    EventDetailsComponent,
    AssociationComponent,
    LoginComponent,
    SingupuserComponent,
    LogementDetailsComponent,
    LogementComponent,
    AddRefugeComponent,
    RefugeComponent,
    LastRefugeComponent,
    ListRefugeComponent,
    ModifierRefugeComponent,
    ReservationComponent,
    AdminReservationsComponent,
    NotificationsRefugeComponent,
    ConnectionComponent,
    PsychologicalTestComponent,
    PsychologicalTestResultsComponent,
    AjouterAssociationComponent,
    ListAssociationComponent,
    ModifierAssociationComponent,
    AjoutStockComponent,
    ListStockComponent,
    ModifierStockComponent,
    StockRetraitComponent,
    AssociationDetailComponent,
    ChatComponent,
    ChatAdminComponent,
    InscriptionComponent,
    AjoutLogistiqueComponent,
    ListelogestiqueComponent,
    EditlogestiqueComponent,
    ListInscriptionComponent,
    MapComponent,
    AjoutDonationComponent,
    DonationDetailsComponent,
    ListDonationComponent,
    AddPaymentComponent,
    MaterialDonationComponent,
    MaterialDonationListComponent,
    FilterByTypePipe,
    PaymentHistoryComponent,
    MaskCardPipe,
    StripeComponent,
    NotificationComponent,

    ScanMedicamentComponent,
    DonorContactComponent,
    PaymentInscriptionComponent,
    RequestListComponent,
    EventsLogestiquesComponent,
    BilletComponent,
    UserProfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LogementsModule,
    ModalModule.forRoot(),
    PickerModule,
    QRCodeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    NotificationTypePipe
  ],
  providers: [
    SseService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
