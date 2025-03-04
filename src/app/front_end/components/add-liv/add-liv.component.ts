import { Component } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison.service';
import { Livraisons } from 'src/app/front_end/pages/models/livraison';

@Component({
  selector: 'app-add-liv',
  templateUrl: './add-liv.component.html',
  styleUrls: ['./add-liv.component.css']
})
export class AddLivComponent {
  livraison: Livraisons = { idLivr: 0, nom: '', adresseLivr: '', dateLivraison: new Date(), etatLivraisons: 'ENCOURS' };
  confirmChecked = false;
  successMessage: string | null = null;
  displayedReceipt: any = null;

  constructor(private livraisonService: LivraisonService) {}

  saveLivraison() {
    if (this.confirmChecked) {
      this.livraisonService.addLivraison(this.livraison).subscribe(
        (livraison) => {
          this.displayedReceipt = { ...this.livraison };
          this.successMessage = 'Delivery has been successfully added!';
          this.clearForm();
        },
        (error) => {
          console.error('Error adding delivery', error);
          this.successMessage = 'Error adding delivery!';
        }
      );
    } else {
      this.successMessage = 'Please confirm before submitting!';
    }
  }

  clearForm() {
    this.livraison = { idLivr: 0, nom: '', adresseLivr: '', dateLivraison: new Date(), etatLivraisons: 'ENCOURS' };
    this.confirmChecked = false;
  }
}