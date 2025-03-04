import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemoinageService } from 'src/app/services/temoinage.service';
import { Temoinage, TemoinageStatut } from 'src/app/front_end/pages/models/temoinage';

@Component({
  selector: 'app-edit-temoinage',
  templateUrl: './edit-temoinage.component.html',
  styleUrls: ['./edit-temoinage.component.css']
})
export class EditTemoinageComponent implements OnInit {
  temoinage: Temoinage = {
    idTemoin: 0,
    nom: '',
    description: '',
    statut: TemoinageStatut.EN_ATTENTE,
    typeTemoinage: '',
    likes: 0,
    comments: [],
    photoUrl: '',
    date: '', // Ajoutez cette propriété
    localisation: '', // Ajoutez cette propriété
    note: 0, // Ajoutez cette propriété
    categorie: '', // Ajoutez cette propriété
    contact: '' // Ajoutez cette propriété
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private temoinageService: TemoinageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.temoinageService.getTemoinageById(+id).subscribe(
        (data) => {
          this.temoinage = data;
        },
        (error) => {
          console.error('Error fetching temoinage', error);
        }
      );
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateTemoinage(): void {
    if (this.selectedFile) {
      // Handle file upload if necessary
    }

    this.temoinageService.updateTemoinage(this.temoinage).subscribe(
      (data) => {
        console.log('Testimonial updated successfully', data);
        this.router.navigate(['/temoinages']);
      },
      (error) => {
        console.error('Error updating testimonial', error);
      }
    );
  }
}