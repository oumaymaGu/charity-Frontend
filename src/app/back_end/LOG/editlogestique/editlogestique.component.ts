import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogestiqueServiceService } from 'src/app/services/logestique-service.service';

@Component({
  selector: 'app-editlogestique',
  templateUrl: './editlogestique.component.html',
  styleUrls: ['./editlogestique.component.css']
})
export class EditlogestiqueComponent {
  logestique: any = {
    idLogestique: null,
    ressourceName: '',
    quantity: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logestiqueService: LogestiqueServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getLogestiqueById(+id);
      }
    });
  }

  getLogestiqueById(id: number): void {
    this.logestiqueService.getlogById(id).subscribe(
      (res) => {
        this.logestique = res;
        console.log('Données de la logistique:', this.logestique);
      },
      (error) => {
        console.error('Erreur lors de la récupération de la logistique:', error);
      }
    );
  }

  updateLogestique(): void {
    console.log('Mise à jour logistique:', this.logestique);
    this.logestiqueService.updateLogestique(this.logestique).subscribe(
      (res) => {
        console.log('Logistique mise à jour avec succès', res);
        this.router.navigate(['/liste-log']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour', error);
      }
    );
  }
}