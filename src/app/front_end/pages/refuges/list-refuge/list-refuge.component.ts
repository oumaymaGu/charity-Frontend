import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Refuge {
  idRfg?: number;
  nom: string;
  prenom: string;
  email: string;
  nationnalite: string;
  datedenaissance: Date;
  localisationActuel: string;
  besoin: string;
  imagePath?: string;
  detectedGender?: string;
  genderConfidence?: number;
  detectedAge?: number;
  emotionHappiness?: number;
  emotionSadness?: number;
  emotionAnger?: number;
  emotionSurprise?: number;
  emotionFear?: number;
  emotionDisgust?: number;
  emotionNeutral?: number;
}

@Component({
  selector: 'app-list-refuge',
  templateUrl: './list-refuge.component.html',
  styleUrls: ['./list-refuge.component.css']
})
export class ListRefugeComponent implements OnInit {
  refuges: Refuge[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRefuges();
  }

  fetchRefuges(): void {
    this.loading = true;
    this.error = null;
    this.http.get<Refuge[]>('http://localhost:8089/refuge/get-all-ref').subscribe({
      next: (data) => {
        this.refuges = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load refuges. Please try again later.';
        console.error('Error fetching refuges:', err);
        this.loading = false;
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/default-image.png'; // fallback image
    }
    return `http://localhost:8089/uploads/images/refuges/${imagePath}`;
  }

  formatConfidence(value?: number | null): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return value.toFixed(1) + '%';
  }

  onImageError(event: Event, refuge: Refuge): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-image.png';
  }
}
