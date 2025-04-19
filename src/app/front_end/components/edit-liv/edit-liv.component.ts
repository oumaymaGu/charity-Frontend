import { Component, OnInit } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison.service';



import { Livraisons } from 'src/app/front_end/pages/models/livraison';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-liv',
  templateUrl: './edit-liv.component.html',
  styleUrls: ['./edit-liv.component.css']
})
export class EditLivComponent implements OnInit {
  livraison: Livraisons = { idLivr: 0, nom: '', adresseLivr: '', dateLivraison: new Date(), etatLivraisons: 'ENCOURS', emailClient: '' };

  constructor(
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.livraisonService.getLivraisonById(+id).subscribe((data) => {
        this.livraison = data;
      });
    }
  }

  saveLivraison(): void {
    this.livraisonService.modifyLivraison(this.livraison).subscribe(() => {
      this.router.navigate(['/list-liv']);
    });
  }
}
