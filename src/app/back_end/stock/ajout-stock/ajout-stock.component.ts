import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

interface Stock {
  idStock?: number;
  capaciteTotale: number;
  typeStock: string;
  lieu: string;
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
        }
      });
  }

  onSubmit() {
    this.submitted = true;

    if (!this.isValid()) {
      this.errorMessage = "Veuillez remplir correctement tous les champs.";
      return;
    }

    this.http.post<Stock>('http://localhost:8089/stock/add-stock', this.stock)
      .subscribe({
        next: (createdStock) => {
          if (createdStock.idStock && this.associationId > 0) {
            this.http.put<Stock>(`http://localhost:8089/stock/affecter-association/${createdStock.idStock}/${this.associationId}`, {})
              .subscribe({
                next: () => {
                  this.successMessage = "Stock ajouté et association affectée avec succès !";
                  this.resetForm();
                  setTimeout(() => this.router.navigate(['/list-stock']), 1000);
                },
                error: () => {
                  this.errorMessage = "Stock ajouté mais échec de l'affectation de l'association.";
                }
              });
          }
        },
        error: () => {
          this.errorMessage = "Erreur lors de l'ajout. Veuillez réessayer.";
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
    if (this.stockForm) {
      this.stockForm.resetForm();
    }
  }
}
