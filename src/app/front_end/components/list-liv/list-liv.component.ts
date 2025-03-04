import { Component, OnInit } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison.service';
import { Livraisons } from 'src/app/front_end/pages/models/livraison';

@Component({
  selector: 'app-list-liv',
  templateUrl: './list-liv.component.html',
  styleUrls: ['./list-liv.component.css']
})
export class ListLivComponent implements OnInit {
  livraisons: Livraisons[] = [];
  confirmLivraisonActive = false;
  livraisonToConfirm: any;
  notification: string = '';

  constructor(private livraisonService: LivraisonService) {}

  ngOnInit(): void {
    this.loadLivraisons();
    this.livraisonService.livraisonAdded$.subscribe(
      (livraison: Livraisons) => this.livraisons.push(livraison)
    );
  }

  loadLivraisons(): void {
    this.livraisonService.getAllLivraisons().subscribe(
      (data) => {
        this.livraisons = data;
      },
      (error) => {
        console.error('Error fetching livraisons', error);
      }
    );
  }

  deleteLivraison(id: number): void {
    this.livraisonService.deleteLivraison(id).subscribe(() => {
      this.livraisons = this.livraisons.filter(livraison => livraison.idLivr !== id);
    });
  }

  // Méthode pour confirmer la livraison
  confirmLivraison(livraison: any) {
    this.livraisonToConfirm = livraison;
    this.confirmLivraisonActive = true;
  }

  // Action après confirmation
  confirmAction() {
    if (this.livraisonToConfirm) {
      this.livraisonToConfirm.etatLivraisons = 'LIVREE'; // Changer l'état de la livraison
      this.confirmLivraisonActive = false;
      console.log('Livraison confirmée:', this.livraisonToConfirm);
    }
  }

  // Annuler l'action de confirmation
  cancelAction() {
    this.confirmLivraisonActive = false;
    console.log('Action annulée');
  }
}