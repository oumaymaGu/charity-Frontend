import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-retrait',
  templateUrl: './stock-retrait.component.html',
  styleUrls: ['./stock-retrait.component.css']
})
export class StockRetraitComponent {

  @Input() stock: any; // Stock passé depuis la liste
  @Output() retraitEffectue = new EventEmitter<void>(); // Pour notifier après retrait
  @Output() fermerModal = new EventEmitter<void>(); // Pour fermer la modale

  quantite: number = 0;

  private apiUrl = 'http://localhost:8089/retrait';

  constructor(private http: HttpClient) {}

  confirmerRetrait(): void {
    if (!this.stock || this.quantite <= 0) {
      alert("Veuillez sélectionner un stock valide et une quantité > 0");
      return;
    }

    // Vérification que la quantité demandée ne dépasse pas la capacité disponible
    if (this.quantite > this.stock.capaciteDisponible) {
      alert("La quantité demandée est supérieure à la capacité disponible.");
      return;
    }

    // Mise à jour immédiate de la capacité (pour l'interface utilisateur)
    this.stock.capaciteDisponible -= this.quantite;

    // Appel API pour effectuer le retrait
    this.http.post<any>(`${this.apiUrl}/ajouter/${this.stock.idStock}/${this.quantite}`, {}).subscribe({
      next: () => {
        alert("✅ Retrait effectué !");
        this.retraitEffectue.emit(); // Émettre l'événement pour notifier le parent
        this.closeRetraitModal();
      },
      error: (err) => {
        console.error("Erreur lors du retrait : ", err);
        alert("❌ Erreur lors du retrait : " + (err.error?.message || err.message));

        // Annuler la mise à jour locale en cas d'erreur
        this.stock.capaciteDisponible += this.quantite;
      }
    });
  }

  closeRetraitModal(): void {
    this.fermerModal.emit();
  }
}
