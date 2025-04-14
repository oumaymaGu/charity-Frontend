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
import { DonateComponent } from './front_end/pages/donate/donate.component';
import { GalleryComponent } from './front_end/pages/gallery/gallery.component';
import { EventComponent } from './front_end/Events/event/event.component';
import { TeamComponent } from './front_end/pages/team/team.component';
//import { JoinComponent } from './front_end/pages/join/join.component';
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
import { AssociationComponent } from './front_end/association/association.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SingupuserComponent } from './singupuser/singupuser.component';
import { AjouterAssociationComponent } from './back_end/associations/ajouter-association/ajouter-association.component';
import { ListAssociationComponent } from './back_end/associations/list-association/list-association.component';
import { ModifierAssociationComponent } from './back_end/associations/modifier-association/modifier-association.component';
import { AjoutStockComponent } from './back_end/stock/ajout-stock/ajout-stock.component';
import { ListStockComponent } from './back_end/stock/list-stock/list-stock.component';
import { ModifierStockComponent } from './back_end/stock/modifier-stock/modifier-stock.component';
import { AssociationDetailComponent } from './front_end/pages/about/association-detail/association-detail.component';







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
      //JoinComponent,
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
      AjouterAssociationComponent,
      ListAssociationComponent,
      ModifierAssociationComponent,
      AjoutStockComponent,
      ListStockComponent,
      ModifierStockComponent,
      AssociationDetailComponent
      
  
    
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule

    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
