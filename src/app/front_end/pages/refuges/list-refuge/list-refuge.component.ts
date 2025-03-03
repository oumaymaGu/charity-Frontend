import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-refuge',
  templateUrl: './list-refuge.component.html',
  styleUrls: ['./list-refuge.component.css']
})
export class ListRefugeComponent implements OnInit {
  refuges: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadRefuges();
  }

  // Charger la liste des refuges depuis l'API
  loadRefuges() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8089/refuge/get-all-ref')
      .subscribe({
        next: (data) => {
          this.refuges = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des refuges';
          this.loading = false;
        }
      });
  }

  // Rediriger vers le chemin /service lorsqu'on clique sur un refuge
  voirService() {
    this.router.navigate(['/service']);
  }


    // Fonction pour revenir à la page précédente
    goBack() {
      this.router.navigate(['/service']);  // Vous pouvez personnaliser cette ligne si nécessaire pour rediriger vers une autre page
    }

    contactRefuge(refuge: any): void {
      // Ouvrir une boîte de dialogue pour envoyer un e-mail
      const subject = `Contact regarding shelter: ${refuge.nom} ${refuge.prenom}`;
      const body = `Hello ${refuge.nom} ${refuge.prenom},\n\nI would like to discuss your needs: ${refuge.besoin}.\n\nBest regards,\n[Your Name]`;
      window.location.href = `mailto:${refuge.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
