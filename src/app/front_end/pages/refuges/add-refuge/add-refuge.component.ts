import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Refuge {
  nom: string;
  prenom: string;
  email: string;
  nationnalite: string;
  datedenaissance: Date;
  localisationActuel: string;
  besoin: string;
}

@Component({
  selector: 'app-add-refuge',
  templateUrl: './add-refuge.component.html',
  styleUrls: ['./add-refuge.component.css']
})
export class AddRefugeComponent {
  refuge: Refuge = {
    nom: '',
    prenom: '',
    email: '',
    nationnalite: '',
    datedenaissance: new Date(),
    localisationActuel: '',
    besoin: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.validateForm()) {
      console.error('Formulaire invalide. Veuillez remplir tous les champs.');
      return;
    }

    this.http.post<Refuge>('http://localhost:8089/refuge/add-ref', this.refuge)
      .subscribe({
        next: (response) => {
          console.log('Refuge ajouté avec succès:', response);
          this.resetForm();
          this.router.navigate(['/lastrefuge']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du refuge:', error);
        }
      });
  }

  validateForm(): boolean {
    return !!(this.refuge.nom && this.refuge.prenom && this.refuge.email &&
      this.refuge.nationnalite && this.refuge.datedenaissance &&
      this.refuge.localisationActuel && this.refuge.besoin);
  }

  resetForm() {
    this.refuge = {
      nom: '',
      prenom: '',
      email: '',
      nationnalite: '',
      datedenaissance: new Date(),
      localisationActuel: '',
      besoin: ''
    };
  }
}
