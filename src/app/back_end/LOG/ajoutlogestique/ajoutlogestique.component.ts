import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Logistique } from 'src/app/front_end/pages/models/Logestique';
import { LogestiqueServiceService } from 'src/app/services/logestique-service.service';



@Component({
  selector: 'app-ajout-logistique', // Correction du sélecteur
  templateUrl: './ajoutlogestique.component.html', // Vérifie que le fichier existe bien
  styleUrls: ['./ajoutlogestique.component.css']
})
export class AjoutLogistiqueComponent {
  logistique: Logistique = new Logistique(); // Objet Logistique

  constructor(private logistiqueService: LogestiqueServiceService, private router: Router) {}
  addLogistique(): void {
    if (this.logistique.quantity < 1) {
      console.error('La quantité doit être supérieure à 0.');
      return;
    }
  
    this.logistiqueService.addlog(this.logistique).subscribe(
      (response: any) => {
        console.log('Logistique ajoutée avec succès', response);
        this.router.navigate(['/liste-log']); // Redirection après succès
      },
      (error: any) => {
        console.error('Erreur lors de l\'ajout de la logistique', error);
      }
    );
  }
}
