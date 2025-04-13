import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { OcrService } from '../../../back_end/services/ocr.service';
import { TypeDon, MaterialCategory } from '../../pages/models/donation';
import { MedicationInfo } from '../../../back_end/services/ocr.service';

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
  isMedication = false;
  medicationInfo: MedicationInfo | null = null;
  scannedImage: File | null = null;
  isScanning = false;
  medicationPreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private donService: DonService,
    private ocrService: OcrService,
    private router: Router
  ) {}

  validateForm(): boolean {
    if (!this.materialDonation.category) {
      return this.setErrorMessage("La catégorie est requise.");
    }

    if (this.isMedication) {
      if (!this.scannedImage) {
        return this.setErrorMessage("Veuillez scanner le médicament.");
      }
      if (!this.medicationInfo) {
        return this.setErrorMessage("Veuillez valider le scan du médicament.");
      }
    } else {
      if (!this.materialDonation.photo) {
        return this.setErrorMessage("La photo est requise.");
      }
    }

    this.errorMessage = '';
    return true;
  }

  setErrorMessage(message: string): boolean {
    this.errorMessage = message;
    return false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
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
    this.selectedMaterial = materialName;
    switch (materialName) {
      case 'Don Food':
        this.materialDonation.category = MaterialCategory.FOOD;
        this.isMedication = false;
        break;
      case 'Don Clothes':
        this.materialDonation.category = MaterialCategory.CLOTHES;
        this.isMedication = false;
        break;
      case 'Médicament':
        this.materialDonation.category = MaterialCategory.MEDICAMENT;
        this.isMedication = true;
        break;
      default:
        this.materialDonation.category = MaterialCategory.CLOTHES;
        this.isMedication = false;
    }
  }

  handleRegularFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.onFileChange(event);
    }
  }

  handleMedicationFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.scannedImage = file;
      // Générer la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.medicationPreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      
      this.scanMedication(file);
    }
  }

  scanMedication(file: File): void {
    this.isScanning = true;
    this.errorMessage = '';
    
    this.ocrService.scanMedication(file).subscribe({
      next: (info) => {
        this.medicationInfo = info;
        this.isScanning = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du scan: ' + err;
        this.isScanning = false;
        this.scannedImage = null;
        this.medicationPreviewUrl = null;
      }
    });
  }

  onSubmit() {
    if (!this.validateForm()) return;

    const donationData: any = {
      idDon: 0,
      donorContact: '',
      typeDon: TypeDon.MATERIEL,
      dateDon: new Date().toISOString(),
      heure: new Date().toLocaleTimeString(),
      photoUrl: '',
      category: this.materialDonation.category
      // Les champs OCR (medicationName, lotNumber, etc.) ne sont plus nécessaires ici,
      // car ils seront détectés côté backend via l'endpoint /add-with-medication
    };

    const photoToUpload = this.isMedication ? this.scannedImage : this.materialDonation.photo;

    if (photoToUpload) {
      this.donService.uploadDonMaterial(donationData, photoToUpload, this.materialDonation.category)
        .subscribe({
          next: () => {
            this.successMessage = 'Don ajouté avec succès !';
            setTimeout(() => this.router.navigate(['/material-donation-list']), 2000);
          },
          error: (err) => {
            this.errorMessage = "Erreur: " + err.message;
          }
        });
    }
  }
}