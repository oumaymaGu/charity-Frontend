  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { AboutComponent } from './front_end/pages/about/about.component';
import { HeaderComponent } from './front_end/header/header.component';
import { CarouselComponent } from './front_end/carousel/carousel.component';
import { BlogComponent } from './front_end/blog/blog.component';
import { FooterComponent } from './front_end/footer/footer.component';
import { TestimonialsComponent } from './front_end/testimonials/testimonials.component';
import { HomeComponent } from './front_end/pages/home/home.component';
import { ServiceComponent } from './front_end/pages/service/service.component';
import { ContactComponent } from './front_end/pages/contact/contact.component';

import { GalleryComponent } from './front_end/pages/gallery/gallery.component';
import { EventComponent } from './front_end/Events/event/event.component';
import { TeamComponent } from './front_end/pages/team/team.component';
import { JoinComponent } from './front_end/pages/join/join.component';
import { SignupComponent } from './front_end/pages/signup/signup.component';
import { ForgetPasswordComponent } from './front_end/pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './front_end/pages/reset-password/reset-password.component';
import { SidebarComponent } from './back_end/sidebar/sidebar.component';
import { NavbarComponent } from './back_end/navbar/navbar.component';
import { DashboardComponent } from './back_end/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { AjoutEventComponent } from './front_end/Events/ajout-event/ajout-event.component';
import { FormsModule } from '@angular/forms';
import { EditEventComponent } from './front_end/Events/edit-event/edit-event.component';
import { EventPageComponent } from './front_end/Events/event-page/event-page.component';
import { EventDetailsComponent } from './front_end/Events/event-details/event-details.component';
import { AjoutDonationComponent } from './front_end/donations/ajout-donation/ajout-donation.component';
import { EditDonationComponent } from './front_end/donations/edit-donation/edit-donation.component';

import { DonationPageComponent } from './front_end/donations/donation-page/donation-page.component';
import { DonateComponent } from './front_end/pages/donate/donate.component';
import { DonationDetailsComponent } from './front_end/donations/donation-details/donation-details.component';
import { ListDonationComponent } from './front_end/donations/list-donation/list-donation.component';

import { EditPaymentComponent } from './front_end/payments/edit-payment/edit-payment.component';
import { ListPaymentComponent } from './front_end/payments/list-payment/list-payment.component';
import { PaymentPageComponent } from './front_end/payments/payment-page/payment-page.component';
import { PaymentDetailsComponent } from './front_end/payments/payment-details/payment-details.component';
import { AddPaymentComponent } from './front_end/payments/ajout-payment/ajout-payment.component';





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
    
      GalleryComponent,
      EventComponent,
      TeamComponent,
      JoinComponent,
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
      AjoutDonationComponent,
      EditDonationComponent,
      DonationDetailsComponent,
      ListDonationComponent,
      DonationPageComponent,
      DonateComponent,
      EditPaymentComponent,
      ListPaymentComponent,
      PaymentPageComponent,
      PaymentDetailsComponent,
      AddPaymentComponent,
     
   
      

    
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule

    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
