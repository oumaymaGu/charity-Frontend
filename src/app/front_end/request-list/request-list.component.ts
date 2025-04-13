import { Component, OnInit } from '@angular/core';
import { DonationRequest } from '../pages/models/donation-request';
import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: DonationRequest[] = [];
  displayedColumns: string[] = [
    'date', 
    'fullName', 
    'userEmail', 
    'message', 
    'deliveryMethod',
   
    'actions' // Colonne actions
  ];
  
  constructor(
    private donationRequestService: DonationRequestService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requests = this.donationRequestService.getAllRequests()
      .sort((a: DonationRequest, b: DonationRequest) => 
        new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getDisplayEmail(request: DonationRequest): string {
    return request.userEmail || 'Non spécifié';
  }

  getStatusDisplay(status: string | undefined): string {
    if (!status) return 'En attente';
    return status === 'accepted' ? 'Acceptée' : 
           status === 'rejected' ? 'Rejetée' : 'En attente';
  }

  acceptRequest(request: DonationRequest): void {
    this.donationRequestService.updateRequestStatus(request.id!, 'accepted');
    this.snackBar.open('Demande acceptée avec succès', 'Fermer', { duration: 3000 });
    this.loadRequests();
  }

  deleteRequest(request: DonationRequest): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.donationRequestService.deleteRequestById(request.id!);
      this.snackBar.open('Demande supprimée avec succès', 'Fermer', { duration: 3000 });
      this.loadRequests();
    }
  }

  returnToDashboard(): void {
    this.router.navigate(['/dash']);
  }
}