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
import { SidebarComponent } from './back_end/sidebar/sidebar.component';
import { NavbarComponent } from './back_end/navbar/navbar.component';
import { DashboardComponent } from './back_end/dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AjoutEventComponent } from './front_end/Events/ajout-event/ajout-event.component';
import { FormsModule } from '@angular/forms';
import { EditEventComponent } from './front_end/Events/edit-event/edit-event.component';
import { EventPageComponent } from './front_end/Events/event-page/event-page.component';
import { EventDetailsComponent } from './front_end/Events/event-details/event-details.component';
import { AssociationComponent } from './front_end/association/association.component';
import { LoginComponent } from './login/login.component';
import { SingupuserComponent } from './singupuser/singupuser.component';
import { LogementComponent } from './front_end/pages/logement/logement.component';
import { CommonModule } from '@angular/common';
import { LogementsModule } from './back_end/logements/logements.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AddRefugeComponent } from './front_end/pages/refuges/add-refuge/add-refuge.component';
import { RefugeComponent } from './front_end/pages/refuges/refuge/refuge.component';
import { LastRefugeComponent } from './front_end/pages/refuges/last-refuge/last-refuge.component';
import { ListRefugeComponent } from './front_end/pages/refuges/list-refuge/list-refuge.component';
import { ModifierRefugeComponent } from './front_end/pages/refuges/modifier-refuge/modifier-refuge.component';
import { LogementDetailsComponent } from './front_end/pages/logement/logement-details.component';
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
    LogementDetailsComponent,
    LogementComponent,
    AddRefugeComponent,
    RefugeComponent,
    LastRefugeComponent,
    ListRefugeComponent,
    ModifierRefugeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    LogementsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
