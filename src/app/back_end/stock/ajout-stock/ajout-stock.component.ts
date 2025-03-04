import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';  // Ajoute cette ligne pour importer NgForm

interface Stock {
  capacite: number;
  acheminement: string;
  typeStock: string;
  associationId: number;
}

@Component({
  selector: 'app-ajouter-stock',
  templateUrl: './ajout-stock.component.html',
  styleUrls: ['./ajout-stock.component.css']
})
export class AjoutStockComponent {
  stock: Stock = {
    capacite: 0,
    acheminement: '',
    typeStock: '',
    associationId: 0
  };

  submitted = false;
  successMessage = '';
  errorMessage = '';

  // Ajouter ViewChild pour accéder au formulaire
  @ViewChild('stockForm') stockForm!: NgForm;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    this.submitted = true;
    
    if (!this.isValid()) {
      this.errorMessage = "Veuillez remplir correctement tous les champs.";
      return;
    }

    this.http.post<Stock>('http://localhost:8089/stock/add-stock', this.stock)
      .subscribe({
        next: (response) => {
          console.log('Stock ajouté avec succès:', response);
          this.successMessage = "Stock ajouté avec succès !";
          this.resetForm();
          setTimeout(() => this.router.navigate(['/list-stock']), 1000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du stock:', error);
          this.errorMessage = "Erreur lors de l'ajout. Veuillez réessayer.";
        }
      });
  }

  isValid(): boolean {
    const { capacite, acheminement, typeStock, associationId } = this.stock;
    return capacite > 0 &&
           acheminement.trim() !== '' &&
           typeStock.trim() !== '' &&
           associationId > 0;
  }

  resetForm() {
    this.stock = {
      capacite: 0,
      acheminement: '',
      typeStock: '',
      associationId: 0
    };
    this.submitted = false;
    if (this.stockForm) {
      this.stockForm.resetForm();  // Réinitialiser le formulaire après soumission
    }
  }
}
