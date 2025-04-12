// src/app/front_end/donations/material-donation/material-donation.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { TypeDon, MaterialCategory } from '../../pages/models/donation';

export interface MaterialDonation {
  category: MaterialCategory;
  photo?: File;
  uploadedImagePreview?: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-material-donation',
  templateUrl: './material-donation.component.html',
  styleUrls: ['./material-donation.component.css']
})
export class MaterialDonationComponent {
  materialDonation: MaterialDonation = {
    category: MaterialCategory.CLOTHES,
  };

  materials: { name: string; img: string; }[] = [
    { name: 'Don Food', img: 'assets/img.don/R1.jpg' },
    { name: 'Don Clothes', img: 'assets/img.don/R2.jpg' },
    { name: 'Médicament', img: 'assets/img.don/R3.jpg' }
  ];

  errorMessage: string = '';
  successMessage: string | null = null;
  selectedMaterial: string | null = null;

  constructor(private donService: DonService, private router: Router) {}

  validateForm(): boolean {
    const { category, photo } = this.materialDonation;

    if (!category) return this.setErrorMessage("La catégorie est requise.");
    if (!photo) return this.setErrorMessage("La photo est requise.");

    this.errorMessage = '';
    return true;
  }

  setErrorMessage(message: string): boolean {
    this.errorMessage = message;
    return false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.materialDonation.photo = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.materialDonation.uploadedImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategorySelect(materialName: string) {
    switch (materialName) {
      case 'Don Food':
        this.materialDonation.category = MaterialCategory.FURNITURE; // Adjust based on your needs
        break;
      case 'Don Clothes':
        this.materialDonation.category = MaterialCategory.CLOTHES;
        break;
      case 'Médicament':
        this.materialDonation.category = MaterialCategory.MEDICAMENT;
        break;
      default:
        this.materialDonation.category = MaterialCategory.CLOTHES;
    }
    this.selectedMaterial = materialName;
  }

  onSubmit() {
    if (!this.validateForm()) return;

    const { photo, ...donData } = {
      ...this.materialDonation,
      idDon: 0,
      donorContact: '',
      typeDon: TypeDon.MATERIEL,
      dateDon: new Date().toISOString(),
      heure: new Date().toLocaleTimeString(),
      photoUrl: '',
    };

    if (photo) {
      this.donService.uploadDonMaterial(donData, photo, this.materialDonation.category).subscribe({
        next: () => {
          this.successMessage = 'Donation matérielle ajoutée avec succès !';
          setTimeout(() => this.router.navigate(['/material-donation-list'], { state: donData }), 2000);
        },
        error: () => {
          this.errorMessage = "Une erreur est survenue lors de l'ajout de la donation.";
        }
      });
    }
  }
}