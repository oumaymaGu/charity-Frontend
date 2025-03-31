import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogestiqueServiceService } from 'src/app/services/logestique-service.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-listelogestique',
  templateUrl: './listelogestique.component.html',
  styleUrls: ['./listelogestique.component.css']
})
export class ListelogestiqueComponent implements OnInit {
  logestiques: any[] = [];
  searchTerm: string = '';

  constructor(private logestiqueService: LogestiqueServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getLogestiques();
  }

  getLogestiques(): void {
    this.logestiqueService.getAlllogestique().subscribe((data: any[]) => {
      this.logestiques = data;
    });
  }

  searchLogestiques(term: string): void {
    if (term) {
      this.logestiques = this.logestiques.filter(logestique => logestique.ressourceName.toLowerCase().includes(term.toLowerCase()));
    } else {
      this.getLogestiques();
    }
  }

  editLogestique(logestique: any): void {
    this.router.navigate(['/edit-log', logestique.idlogestique]);
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer ce logistique?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteLogestique(id);
        Swal.fire(
          'Supprimé!',
          'Le logistique a été supprimé.',
          'success'
        );
      }
    });
  }

  deleteLogestique(id: number): void {
    this.logestiqueService.deleteLogestique(id).subscribe(() => {
      this.getLogestiques(); // Refresh the list after deletion
    });
  }


  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
