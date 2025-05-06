import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

interface Stock {
  idStock?: number;
  capaciteTotale: number;
  typeStock: string;
  lieu: string;
  associations?: {
    idAss: number;
  };
}

interface Association {
  idAss: number;
  nomAss: string;
}

@Component({
  selector: 'app-ajouter-stock',
  templateUrl: './ajout-stock.component.html',
  styleUrls: ['./ajout-stock.component.css']
})
export class AjoutStockComponent implements OnInit {
  stock: Stock = {
    capaciteTotale: 0,
    typeStock: '',
    lieu: ''
  };

  associationId: number = 0;
  associations: Association[] = [];

  submitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  @ViewChild('stockForm') stockForm!: NgForm;

  stockTypes: string[] = ['Food', 'Clothing', 'Medicine'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAssociations();
  }

  loadAssociations(): void {
    this.http.get<Association[]>('http://localhost:8089/association/get-all-ass')
      .subscribe({
        next: (data) => this.associations = data,
        error: (err) => {
          console.error('Erreur lors du chargement des associations', err);
          this.errorMessage = "Impossible de charger les associations. Veuillez rafraîchir la page.";
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isValid()) {
      this.errorMessage = "Veuillez remplir correctement tous les champs.";
      return;
    }
    
    this.isLoading = true;
    
    // Créer un nouvel objet pour l'envoi
    const stockToSubmit: Stock = {
      capaciteTotale: this.stock.capaciteTotale,
      typeStock: this.stock.typeStock,
      lieu: this.stock.lieu,
      associations: {
        idAss: this.associationId
      }
    };
    
    console.log('Envoi des données:', JSON.stringify(stockToSubmit));
    
    this.http.post<Stock>('http://localhost:8089/stock/add-stock', stockToSubmit)
      .subscribe({
        next: (createdStock) => {
          console.log('Réponse du serveur:', JSON.stringify(createdStock));
          this.successMessage = "Stock ajouté avec succès !";
          this.resetForm();
          setTimeout(() => this.router.navigate(['/list-stock']), 1500);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur détaillée:', error);
          
          if (error.status === 0) {
            this.errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
          } else if (error.status === 400) {
            this.errorMessage = "Données invalides: " + (error.error?.message || "Veuillez vérifier les informations saisies.");
          } else if (error.status === 500) {
            this.errorMessage = "Erreur serveur: " + (error.error?.message || "Un problème est survenu côté serveur.");
            console.error('Corps de la réponse d\'erreur:', error.error);
          } else {
            this.errorMessage = "Erreur lors de l'ajout. " + (error.error?.message || error.statusText || "Veuillez réessayer.");
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  isValid(): boolean {
    const { capaciteTotale, typeStock, lieu } = this.stock;
    return capaciteTotale > 0 &&
           typeStock.trim() !== '' &&
           lieu.trim() !== '' &&
           this.associationId > 0;
  }

  resetForm() {
    this.stock = {
      capaciteTotale: 0,
      typeStock: '',
      lieu: ''
    };
    this.associationId = 0;
    this.submitted = false;
    this.isLoading = false;
    if (this.stockForm) {
      this.stockForm.resetForm();
    }
  }
}