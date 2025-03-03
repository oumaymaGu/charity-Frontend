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

  addLogistique() { // Méthode pour ajouter une logistique
    this.logistiqueService.addlog(this.logistique).subscribe(
      (response: any) => {
        console.log('Logistique added successfully', response); // Message de succès
        this.router.navigate(['/liste-log']); // Redirection après succès
      },
      (error: any) => {
        console.error('Error adding logistique', error); // Correction du message d'erreur
      }
    );
  }
}
