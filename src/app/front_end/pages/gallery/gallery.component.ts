import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim } from 'src/app/front_end/pages/models/claim.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  claim: Claim = { name: '', email: '', message: '' };
  claims: Claim[] = [];  // This array will store the list of claims

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    // Fetch all claims when the component initializes
    this.loadClaims();
  }

  // Method to submit the claim
  onSubmit() {
    this.claimService.sendClaim(this.claim).subscribe(response => {
      alert('Claim sent successfully!');
      this.claims.push(response); // utiliser la réponse renvoyée par le backend
      this.claim = { name: '', email: '', message: '' };
      this.loadClaims();
    });
  }
  

  // Method to load all claims from the backend
  loadClaims(): void {
    this.claimService.getAllClaims().subscribe(data => {
      this.claims = data;  // Update the claims array
    });
  }
}
