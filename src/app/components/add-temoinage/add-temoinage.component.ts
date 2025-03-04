import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TemoinageService } from 'src/app/services/temoinage.service';
import { Temoinage, TemoinageStatut } from 'src/app/front_end/pages/models/temoinage';

@Component({
  selector: 'app-add-temoinage',
  templateUrl: './add-temoinage.component.html',
  styleUrls: ['./add-temoinage.component.css']
})
export class AddTemoinageComponent {
  temoinage: Temoinage = {
    nom: '',
    description: '',
    statut: TemoinageStatut.EN_ATTENTE,
    typeTemoinage: '',
    likes: 0,
    comments: [],
    photoUrl: '',
    date: '',
    localisation: '',
    note: 0,
    categorie: '',
    contact: ''
  };
  selectedFile: File | null = null;

  constructor(private temoinageService: TemoinageService, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveTemoinage(): void {
    if (this.selectedFile) {
      // Handle file upload if necessary
    }

    this.temoinageService.addTemoinage(this.temoinage).subscribe(
      (data) => {
        console.log('Testimonial added successfully', data);
        this.router.navigate(['/temoinages']);
      },
      (error) => {
        console.error('Error adding testimonial', error);
      }
    );
  }
}