import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Stock {
  idStock: number;
  capaciteTotale: number;
  capaciteDisponible: number;
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
  sortField: string = 'capaciteDisponible'; // Champ de tri par défaut
  sortDirection: 'asc' | 'desc' = 'desc'; // Direction de tri par défaut (décroissant)

  stockSelectionnePourRetrait: any = null;

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
          this.sortStocks(); // Trier les stocks après chargement
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des stocks';
          this.loading = false;
          console.error('Erreur détaillée:', error);
        }
      });
  }

  // Fonction pour trier les stocks
  sortStocks() {
    this.stocks.sort((a, b) => {
      const valueA = a[this.sortField as keyof Stock] as number;
      const valueB = b[this.sortField as keyof Stock] as number;
      
      if (this.sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }

  // Fonction pour changer le champ de tri
  changeSortField(field: string) {
    if (this.sortField === field) {
      // Si on clique sur le même champ, on inverse la direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Sinon, on change le champ et on met la direction par défaut
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.sortStocks();
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

  fermerModaleRetrait() {
    this.stockSelectionnePourRetrait = null;
  }

  ouvrirModaleRetrait(stock: any): void {
    this.stockSelectionnePourRetrait = { ...stock }; // Créer une copie de l'objet stock
  }

  refreshStocks(): void {
    this.loadStocks();
  }
  
  isStockCritique(stock: any): boolean {
    const ratio = stock.capaciteDisponible / stock.capaciteTotale;
    return ratio < 0.5;
  }
  
  getStockStatus(stock: any): string {
    const ratio = stock.capaciteDisponible / stock.capaciteTotale;
    if (ratio < 0.2) return 'critical';
    if (ratio < 0.5) return 'warning';
    return 'normal';
  }
  
  // Fonction pour obtenir l'icône de tri
  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
}