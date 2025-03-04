import { Component, OnInit } from '@angular/core';
import { TemoinageService } from 'src/app/services/temoinage.service';
import { Temoinage } from 'src/app/front_end/pages/models/temoinage';

@Component({
  selector: 'app-temoinage-list',
  templateUrl: './temoinage-list.component.html',
  styleUrls: ['./temoinage-list.component.css']
})
export class TemoinageListComponent implements OnInit {
  temoinages: Temoinage[] = [];
  newComment: string = '';
  notification: string = '';

  constructor(private temoinageService: TemoinageService) {}

  ngOnInit(): void {
    this.loadTemoinages();
  }

  // Charger les témoignages depuis l'API
  loadTemoinages(): void {
    this.temoinageService.getTemoinages().subscribe(
      (data) => {
        this.temoinages = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des témoignages', error);
        this.notification = 'Erreur de chargement des témoignages';
      }
    );
  }

  // Suppression d'un témoignage
  deleteTemoinage(temoinage: Temoinage): void {
    // Vérifie si l'ID du témoignage est défini
    if (!temoinage.idTemoin) {
      console.error('Erreur: ID du témoignage non défini');
      this.notification = 'Erreur: ID du témoignage non défini';
      return;
    }

    // Confirmation avant de supprimer
    if (confirm(`Voulez-vous vraiment supprimer le témoignage de ${temoinage.nom} ?`)) {
      // Appel à l'API pour supprimer le témoignage
      this.temoinageService.deleteTemoinage(temoinage.idTemoin).subscribe(
        () => {
          // Mise à jour de la liste des témoignages après la suppression
          this.temoinages = this.temoinages.filter(t => t.idTemoin !== temoinage.idTemoin);
          this.notification = 'Témoignage supprimé avec succès';
        },
        (error: any) => {
          console.error('Erreur lors de la suppression du témoignage', error);
          this.notification = 'Erreur lors de la suppression du témoignage';
        }
      );
    }
  }

  // Ajouter un commentaire
  addComment(temoinage: Temoinage): void {
    if (this.newComment.trim()) {
      // Vérifie si le témoignage a des commentaires et ajoute le nouveau
      if (!temoinage.comments) {
        temoinage.comments = [];
      }
      temoinage.comments.push(this.newComment);
      this.newComment = ''; // Réinitialise le champ de commentaire
    }
  }
}