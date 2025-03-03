import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modifier-refuge',
  templateUrl: './modifier-refuge.component.html',
  styleUrls: ['./modifier-refuge.component.css']
})
export class ModifierRefugeComponent implements OnInit {
  refuge: any = {}; // Modèle des données du refuge
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const idRfg = this.route.snapshot.paramMap.get('idRfg'); // Récupération de l'id du refuge via l'URL
    if (idRfg) {
      this.loadRefuge(idRfg); // Charge les données du refuge pour la modification
    }
  }

  // Charger les données existantes du refuge
  loadRefuge(id: string) {
    this.loading = true;
    this.http.get(`http://localhost:8089/refuge/get-ref/${id}`)
      .subscribe({
        next: (data) => {
          this.refuge = data; // Remplir le modèle avec les données reçues
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des données du refuge';
          this.loading = false;
        }
      });
  }

  // Soumettre le formulaire pour mettre à jour les données du refuge
  onSubmit() {
    this.loading = true;
    this.http.put(`http://localhost:8089/refuge/updateref`, this.refuge)
      .subscribe({
        next: () => {
          alert('Refuge modifié avec succès.');
          this.router.navigate(['/service']); // Rediriger vers la liste des refuges après modification
        },
        error: (error) => {
          this.error = 'Erreur lors de la modification du refuge';
          this.loading = false;
        }
      });
  }

  // Réinitialiser le formulaire avec les données du refuge actuel
  resetForm() {
    this.refuge = { ...this.refuge }; // Réinitialiser aux données précédentes
  }
}
