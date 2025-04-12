import { Component } from '@angular/core';
import { MedicationInfo, OcrService } from 'src/app/back_end/services/ocr.service';


@Component({
  selector: 'app-scan-medicament',
  templateUrl: './scan-medicament.component.html',
  styleUrls: ['./scan-medicament.component.css']
})
export class ScanMedicamentComponent {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  medicationInfo: MedicationInfo | null = null;
  isLoading = false;
  error: string | null = null;
  showDebug = false;

  constructor(private ocrService: OcrService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    // Validation
    if (!file.type.match('image.*')) {
      this.error = 'Seules les images sont acceptées';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'L\'image ne doit pas dépasser 5MB';
      return;
    }

    this.selectedFile = file;
    this.error = null;
    this.medicationInfo = null;

    // Prévisualisation
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }

  scanImage(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.error = null;

    this.ocrService.scanMedication(this.selectedFile).subscribe({
      next: (info) => {
        this.medicationInfo = info;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
      }
    });
  }

  reset(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.medicationInfo = null;
    this.error = null;
    (document.getElementById('fileInput') as HTMLInputElement).value = '';
  }

  toggleDebug(): void {
    this.showDebug = !this.showDebug;
  }
}