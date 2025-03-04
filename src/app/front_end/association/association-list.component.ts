// association-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AssociationService } from 'src/app/front_end/association/services/association.service';
import { Association } from 'src/app/front_end/association/association.model';

@Component({
  selector: 'app-association-list',
  template: `
    <h2>Liste des associations</h2>
    <ul>
      <li *ngFor="let association of associations">
        {{ association.name }}
        <button (click)="deleteAssociation(association.id)">Supprimer</button>
        <button (click)="editAssociation(association.id)">Modifier</button>
      </li>
    </ul>
    <button (click)="openCreateForm()">Ajouter une association</button>
  `
})
export class AssociationListComponent implements OnInit {
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

  deleteAssociation(id: string) {
    this.associationService.deleteAssociation(id).subscribe(() => {
      this.loadAssociations();
    });
  }

  editAssociation(id: string) {
    // Ouvrir le formulaire de modification avec l'id de l'association
  }

  openCreateForm() {
    // Ouvrir le formulaire de création d'association
  }
}
