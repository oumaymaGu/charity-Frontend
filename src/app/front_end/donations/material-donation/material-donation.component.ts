import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DonService } from '../../../back_end/services/donation.service';
import { OcrService } from '../../../back_end/services/ocr.service';
import { TypeDon, MaterialCategory } from '../../pages/models/donation';
import { MedicationInfo } from '../../pages/models/medication-info';

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

  materials = [
    { name: 'Don Food', img: 'assets/img.don/R1.jpg' },
    { name: 'Don Clothes', img: 'assets/img.don/R2.jpg' },
    { name: 'Médicament', img: 'assets/img.don/R3.jpg' }
  ];

  errorMessage = '';
  successMessage: string | null = null;
  scanSuccessMessage: string | null = null;
  selectedMaterial: string | null = null;
  isMedication = false;
  medicationInfo: MedicationInfo | null = null;
  scannedImage: File | null = null;
  isScanning = false;
  medicationPreviewUrl: string | ArrayBuffer | null = null;
  isSubmitting = false;

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
    console.error('Form validation error:', message);
    return false;
  }

  handleFile(event: Event, isMedication: boolean = false): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isMedication) {
          this.scannedImage = file;
          this.medicationPreviewUrl = reader.result;
          console.log('Medication image selected:', file.name);
          this.scanMedication(file);
        } else {
          this.materialDonation.photo = file;
          this.materialDonation.uploadedImagePreview = reader.result;
          console.log('Material donation image selected:', file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onCategorySelect(materialName: string): void {
    this.selectedMaterial = materialName;
    console.log('Selected material:', materialName);
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

  scanMedication(file: File): void {
    this.isScanning = true;
    this.errorMessage = '';
    this.scanSuccessMessage = null;
    console.log('Starting medication scan for file:', file.name);

    this.ocrService.scanMedication(file).subscribe({
      next: (info: MedicationInfo) => {
        if (!info.expirationValid) {
          this.errorMessage = `Le don n'est pas accepté : le médicament est expiré ou expire trop tôt (exp: ${info.expirationDate}).`;
          this.medicationInfo = null;
          this.scannedImage = null;
          this.medicationPreviewUrl = null;
          console.warn('Medication scan failed: Expired or soon to expire:', info.expirationDate);
        } else {
          this.medicationInfo = info;
          this.scanSuccessMessage = `Médicament valide : expire le ${info.expirationDate}. Vous pouvez soumettre le don.`;
          console.log('Medication scan successful:', info);
        }
        this.isScanning = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du scan: ' + err.message;
        this.isScanning = false;
        this.scannedImage = null;
        this.medicationPreviewUrl = null;
        console.error('Medication scan error:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      console.warn('Submission already in progress. Ignoring duplicate submission.');
      return;
    }
    if (!this.validateForm()) {
      console.warn('Form validation failed. Submission aborted.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = null;

    const donorContact = localStorage.getItem('email') || 'No email provided';
    const donorName = localStorage.getItem('username') || 'Anonymous';

    const donationData = {
      idDon: 0,
      donorContact,
      donorName,
      typeDon: TypeDon.MATERIEL,
      dateDon: new Date().toISOString(),
      heure: new Date().toLocaleTimeString(),
      photoUrl: '',
      category: this.materialDonation.category,
      ...(this.isMedication && this.medicationInfo ? {
        medicationName: this.medicationInfo.medicationName,
        expirationDate: this.medicationInfo.expirationDate,
        fabricationDate: this.medicationInfo.fabricationDate,
        lotNumber: this.medicationInfo.lotNumber,
        productCode: this.medicationInfo.productCode
      } : {})
    };

    console.log('Submitting donation data:', donationData);

    const photoToUpload = this.isMedication ? this.scannedImage : this.materialDonation.photo;

    if (photoToUpload) {
      this.donService.uploadDonMaterial(donationData, photoToUpload, this.materialDonation.category)
        .subscribe({
          next: () => {
            this.successMessage = 'Don ajouté avec succès !';
            console.log('Donation submitted successfully');
            setTimeout(() => {
              this.router.navigate(['/material-donation-list']);
              this.resetForm();
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || err.message || "Erreur lors de l'ajout du don.";
            this.isSubmitting = false;
            console.error('Donation submission error:', err);
          }
        });
    } else {
      this.isSubmitting = false;
      this.setErrorMessage('Aucune photo à uploader.');
      console.warn('No photo to upload. Submission aborted.');
    }
  }

  resetForm(): void {
    this.materialDonation = {
      category: MaterialCategory.CLOTHES,
    };
    this.scannedImage = null;
    this.medicationPreviewUrl = null;
    this.medicationInfo = null;
    this.isMedication = false;
    this.selectedMaterial = null;
    this.errorMessage = '';
    this.successMessage = null;
    this.scanSuccessMessage = null;
    this.isScanning = false;
    this.isSubmitting = false;
    console.log('Form reset');
  }
}