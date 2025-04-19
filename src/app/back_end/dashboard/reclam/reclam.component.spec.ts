import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim } from 'src/app/front_end/pages/models/claim.model';

@Component({
  selector: 'app-reclam',
  templateUrl: './reclam.component.html',
  styleUrls: ['./reclam.component.css']
})
export class ReclamComponent implements OnInit {
  claims: Claim[] = [];

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.claimService.getAllClaims().subscribe(data => {
      this.claims = data;
    });
  }
}
