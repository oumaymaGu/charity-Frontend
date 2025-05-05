import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {
  constructor(private router: Router) {}

  navigateToAddTestimonial(): void {
    this.router.navigate(['/add-temoinage']);
  }
  onClick() {
    console.log('Clicked, navigating to:', '/temoignages-public');
  }
}