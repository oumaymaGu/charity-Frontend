// association.component.ts
import { Component, OnInit } from '@angular/core';
import { AssociationService } from 'src/app/front_end/association/services/association.service';
import { Association } from 'src/app/front_end/association/association.model'; // Assurez-vous d'importer le modèle Association correct';

@Component({
  selector: 'app-association',
  template: `
    <h1>Associations</h1>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let association of associations">
          <td>{{ association.name }}</td>
          <td>{{ association.description }}</td>
          <td>
            <button (click)="viewAssociation(association.id)">Voir</button>
            <button (click)="editAssociation(association.id)">Modifier</button>
            <button (click)="deleteAssociation(association.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class AssociationComponent implements OnInit {
  associations: Association[] = [];

  constructor(private associationService: AssociationService) {}

  ngOnInit() {
    this.loadAssociations();
  }

  loadAssociations() {
    this.associationService.getAssociations().subscribe(associations => {
      this.associations = associations;
    });
  }

  viewAssociation(id: string) {
    // Naviguer vers la page de détails de l'association
  }

  editAssociation(id: string) {
    // Naviguer vers le formulaire de modification de l'association
  }

  deleteAssociation(id: string) {
    this.associationService.deleteAssociation(id).subscribe(() => {
      this.loadAssociations();
    });
  }
}
