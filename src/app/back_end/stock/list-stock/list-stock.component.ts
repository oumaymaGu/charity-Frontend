import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Stock {
  idStock: number;
  capaciteTotale: number;
  typeStock: string;
  lieu: string;
  associations?: {
    idAss: number;
    nomAss: string;
  };
}




@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.css']
})
export class ListStockComponent implements OnInit {
  stocks: Stock[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loading = true;
    this.http.get<Stock[]>('http://localhost:8089/stock/get-all-stock')
      .subscribe({
        next: (data) => {
          this.stocks = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des stocks';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }

  deleteStock(idStock: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stock ?')) {
      this.http.delete(`http://localhost:8089/stock/remove-stock/${idStock}`)
        .subscribe({
          next: () => {
            this.loadStocks();
            alert('Stock supprimé avec succès');
          },
          error: (error) => {
            console.error('Erreur détaillée lors de la suppression:', error);
            if (error.status === 404) {
              alert('Stock non trouvé');
            } else {
              alert('Erreur lors de la suppression');
            }
          }
        });
    }
  }

  modifierStock(stock: Stock) {
    this.router.navigate(['/modifier-stock', stock.idStock]);
  }

  searchStock() {
    if (this.searchTerm) {
      this.http.get<Stock>(`http://localhost:8089/stock/get-stock/${this.searchTerm}`)
        .subscribe({
          next: (data) => {
            this.stocks = data ? [data] : [];
          },
          error: (error) => {
            console.error('Erreur lors de la recherche:', error);
            this.error = 'Stock non trouvé';
          }
        });
    } else {
      this.loadStocks();
    }
  }
}
