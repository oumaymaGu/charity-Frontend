import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-stock',
  templateUrl: './modifier-stock.component.html',
  styleUrls: ['./modifier-stock.component.css']
})
export class ModifierStockComponent implements OnInit {
  stock = {
    idStock: 0,
    capacite: 0,
    acheminement: '',
    TypeStock: '',
    associations: {
      idAss: 0,
      nomAss: ''
    }
  };

  associations: any[] = [];  // Liste des associations disponibles
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadStock(id);
      // Charger les associations disponibles pour le stock
  }

  loadStock(id: number) {
    this.http.get(`http://localhost:8089/stock/get-stock/${id}`)
      .subscribe({
        next: (data: any) => {
          this.stock = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement:', error);
          this.errorMessage = 'Erreur lors du chargement du stock';
        }
      });
  }

  

  onSubmit() {
    this.http.put(`http://localhost:8089/stock/update-stock`, this.stock)
      .subscribe({
        next: () => {
          this.successMessage = 'Stock modifié avec succès';
          this.router.navigate(['/list-stock']);  // Rediriger vers la liste des stocks après modification
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.errorMessage = 'Erreur lors de la modification du stock';
        }
      });
  }
}
