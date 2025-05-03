import { Component } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison.service';
import { Livraisons } from 'src/app/front_end/pages/models/livraison';
import { UnsplashService } from 'src/app/services/unsplash.service' // Import du service Unsplash
import SignaturePad from 'signature_pad';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-liv',
  templateUrl: './add-liv.component.html',
  styleUrls: ['./add-liv.component.css']
})
export class AddLivComponent {
  livraison: Livraisons = { idLivr: 0, nom: '', adresseLivr: '', dateLivraison: new Date(), etatLivraisons: 'ENCOURS', emailClient: '', pinCode: '' };
  confirmChecked = false;
  successMessage: string | null = null;
  displayedReceipt: any = null;
  randomImageUrl: string = ''; 
  signatureImage?: string;
  enteredPin: string = ''; 
  errorMessage: string | null = null;
  estimatedTime: string = '';  // Temps estimé de livraison
  address: string = '';  // Adresse de l'utilisateur
  apiKey: string = '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';
   // Variable pour stocker l'URL de l'image aléatoire
   mapboxAccessToken: string = 'pk.eyJ1IjoiaGFkaGVtaTIyIiwiYSI6ImNtYTVreG14OTBqY3QyaXF6M3lpcnAxZmMifQ.oEbvPz7gb6TvjwW07jEYXg';
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  
  constructor(
    private livraisonService: LivraisonService,
    private unsplashService: UnsplashService ,
    private http: HttpClient  // Injection du service Unsplash
  ) {}

  // Cette fonction s'appelle lors de l'initialisation du composant
  ngOnInit(): void {
    this.loadRandomImage();  // Charge une image aléatoire lors du chargement du composant
  }
  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasRef.nativeElement);
  }
  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      alert('Veuillez signer avant d\'enregistrer.');
      return;
    }
    const dataUrl = this.signaturePad.toDataURL(); // Données base64
    this.livraison.signatureImage = dataUrl;
    
  }

  // Fonction pour récupérer l'image aléatoire de Unsplash
  loadRandomImage() {
    this.unsplashService.getRandomImage('box').subscribe(
      (url) => {
        this.randomImageUrl = url;  // Met l'URL de l'image dans la variable
        console.log('Image URL:', this.randomImageUrl);  // Log l'URL pour vérifier
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'image', error);
      }
    );
  }
  private getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(imageUrl, { responseType: 'blob' }).subscribe(
        (blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject('Failed to convert image to base64');
            }
          };
          reader.onerror = () => reject('Error reading image');
          reader.readAsDataURL(blob);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  // Fonction pour ajouter une livraison
  saveLivraison() {
    const pin = Math.floor(1000 + Math.random() * 9000);
    this.livraison.pinCode = pin.toString();
    if (this.confirmChecked) {
      this.saveSignature();
      this.livraisonService.addLivraison(this.livraison).subscribe(
        (livraison) => {
          this.displayedReceipt = { ...this.livraison };
          this.successMessage = 'Delivery has been successfully added!';
          this.clearForm();
        },
        (error) => {
          console.error('Error adding delivery', error);
          this.successMessage = 'Error adding delivery!';
        }
      );
    } else {
      this.successMessage = 'Please confirm before submitting!';
    }
  }

  // Fonction pour vider le formulaire après soumission
  clearForm() {
    this.livraison = { idLivr: 0, nom: '', adresseLivr: '', dateLivraison: new Date(), etatLivraisons: 'ENCOURS', emailClient: '' };
    this.confirmChecked = false;
  }
  downloadImage() {
    this.unsplashService.downloadImage(this.randomImageUrl);
  }
  validatePin() {
    if (this.enteredPin === this.livraison.pinCode) {
      this.successMessage = "PIN correct. Livraison validée!";
      this.errorMessage = null;
      // Tu peux envoyer un signal pour mettre à jour l'état de la livraison ou autre action
    } else {
      this.errorMessage = "Le code PIN est incorrect. Essayez à nouveau.";
      this.successMessage = null;
    }
  }
  async generatePDF() {
    const doc = new jsPDF();

    // Log the livraison data to debug
    console.log('Livraison Data:', this.livraison);

    // Add a watermark
    try {
      console.log('Adding watermark...');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(40);
      doc.setTextColor(200, 200, 200);
      doc.text('Humanité', 105, 150, { align: 'center', angle: 45 });
      console.log('Watermark added successfully');
    } catch (error) {
      console.error('Error adding watermark to PDF:', error);
    }

    // Add a border around the content
    try {
      console.log('Adding border...');
      doc.setLineWidth(0.5);
      doc.setDrawColor(33, 150, 243);
      doc.rect(5, 5, 200, 287, 'S');
      console.log('Border added successfully');
    } catch (error) {
      console.error('Error adding border to PDF:', error);
    }

    // Add the Humanité logo
    
    const logoUrl = '/assets/images/logo.png';
    let humaniteLogoBase64: string;
    try {
      console.log('Fetching logo...');
      humaniteLogoBase64 = await this.getBase64ImageFromUrl(logoUrl);
      console.log('Logo fetched successfully');
    } catch (error) {
      console.error('Error fetching logo:', error);
      humaniteLogoBase64 = '';
    }

    if (humaniteLogoBase64) {
      const logoWidth = 40;
      const logoHeight = 20;
      try {
        console.log('Adding logo...');
        doc.addImage(humaniteLogoBase64, 'PNG', 10, 10, logoWidth, logoHeight);
        console.log('Logo added successfully');
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    } else {
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text('Logo indisponible', 10, 10);
    }

    // Add a header with a background color
    try {
      console.log('Adding header...');
      doc.setFillColor(33, 150, 243);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Reçu de Livraison', 105, 20, { align: 'center' });
      console.log('Header added successfully');
    } catch (error) {
      console.error('Error adding header to PDF:', error);
    }

    // Add a horizontal line under the header
    try {
      console.log('Adding header line...');
      doc.setLineWidth(0.5);
      doc.setDrawColor(33, 150, 243);
      doc.line(10, 32, 200, 32);
      console.log('Header line added successfully');
    } catch (error) {
      console.error('Error adding header line to PDF:', error);
    }

    // Add a subtitle
    try {
      console.log('Adding subtitle...');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(33, 150, 243);
      doc.text('Détails de la Livraison', 10, 38);
      console.log('Subtitle added successfully');
    } catch (error) {
      console.error('Error adding subtitle to PDF:', error);
    }

    // Format the date for display
    let formattedDate: string;
    try {
      formattedDate = new Date(this.livraison.dateLivraison).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      formattedDate = 'N/A';
    }

    // Add delivery details as a table
    try {
      console.log('Attempting to add table with autoTable...');
      autoTable(doc, {
        startY: 45,
        head: [['Champ', 'Valeur']],
        body: [
          ['Nom', this.livraison.nom || 'N/A'],
          ['Adresse', this.livraison.adresseLivr || 'N/A'],
          ['Email', this.livraison.emailClient || 'N/A'],
          ['Date de Livraison', formattedDate],
          ['Code de Livraison', this.livraison.pinCode || 'N/A'],
          ['État', { content: this.livraison.etatLivraisons || 'N/A', styles: { fontStyle: this.livraison.etatLivraisons === 'ENCOURS' ? 'bold' : 'normal' } }],
        ],
        theme: 'striped',
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontSize: 12,
          fontStyle: 'bold'
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { left: 10, right: 10 },
        styles: {
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [150, 150, 150]
        }
      });
      console.log('Table added successfully');
    } catch (error) {
      console.error('Error adding table to PDF:', error);
      // Fallback: Add details manually
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      let yPosition = 45;
      const fields = [
        { label: 'Nom:', value: this.livraison.nom || 'N/A' },
        { label: 'Adresse:', value: this.livraison.adresseLivr || 'N/A' },
        { label: 'Email:', value: this.livraison.emailClient || 'N/A' },
        { label: 'Date de Livraison:', value: formattedDate },
        { label: 'Code de Livraison:', value: this.livraison.pinCode || 'N/A' },
        { label: 'État:', value: this.livraison.etatLivraisons || 'N/A' },
      ];
      fields.forEach(field => {
        doc.setFont('helvetica', 'bold');
        doc.text(field.label, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(field.value, 60, yPosition);
        yPosition += 10;
      });
    }

    // Add a signature section
    let yPosition = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 15 : 110;
    try {
      // Add a title for the signature section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(33, 150, 243);
      

      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 10, 190, 30, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Signature:', 10, yPosition);

      if (this.livraison.signatureImage) {
        console.log('Rendering signature:', this.livraison.signatureImage);
        doc.addImage(this.livraison.signatureImage, 'PNG', 50, yPosition - 5, 50, 20);
      } else {
        console.log('No signature provided');
        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.line(50, yPosition + 1, 150, yPosition + 1);
      }

      // Add confirmation message
      yPosition += 30;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Livraison confirmée par le client', 10, yPosition);
    } catch (error) {
      console.error('Error adding signature to PDF:', error);
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 0, 0);
      doc.line(50, yPosition + 1, 150, yPosition + 1);
    }

    // Add a QR code for tracking
    try {
      const trackingUrl = `https://yourapp.com/track/${this.livraison.pinCode}`; // Replace with your actual tracking URL
      const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);
      doc.addImage(qrCodeDataUrl, 'PNG', 160, yPosition - 25, 30, 30);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text('Scanner pour suivre', 160, yPosition + 10);
    } catch (error) {
      console.error('Error adding QR code to PDF:', error);
    }

    // Add a footer with timestamp and contact info
    try {
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      const timestamp = new Date().toLocaleString('fr-FR');
      doc.text('Merci de soutenir Humanité', 105, 287, { align: 'center' });
      doc.text('Contactez-nous : contact@humanite.org | +33 1 23 45 67 89', 105, 282, { align: 'center' });
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 195, 287, { align: 'right' });
      doc.text(`Généré le ${timestamp}`, 10, 287);
    } catch (error) {
      console.error('Error adding footer to PDF:', error);
    }

    // Save the PDF
    try {
      doc.save('livraison_recu.pdf');
    } catch (error) {
      console.error('Error saving PDF:', error);
    }
  }
  downloadPdf() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8089/pdf/recu/27';
    link.target = '_blank';
    link.download = 'recu.pdf'; // nom du fichier téléchargé
    link.click();
  }
  async estimateDeliveryTime() {
    console.log('Button clicked! Address value:', this.address);
    if (!this.address || this.address.trim() === '' || this.address.trim() === "Entrez l'adresse de départ") {
      this.errorMessage = 'Veuillez entrer une adresse valide (ex: 123 Rue de Rivoli, Paris).';
      this.estimatedTime = '';
      console.log('Validation failed. Address:', this.address);
      return;
    }
  
    try {
      console.log('Estimating delivery time for address:', this.address);
      const originCoords = await this.geocodeAddress(this.address);
      console.log('Origin Coordinates:', originCoords);
      const destinationCoords = [2.2945, 48.8584]; // Tour Eiffel, Paris
      const duration = await this.getTravelTime(originCoords, destinationCoords);
      const totalMinutes = Math.round(duration / 60); // Convertir en minutes
      const hours = Math.floor(totalMinutes / 60); // Calculer les heures
      const minutes = totalMinutes % 60; // Calculer les minutes restantes
      this.estimatedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`; // Afficher en heures et minutes
      console.log('Estimated Time:', this.estimatedTime);
      this.errorMessage = null;
    } catch (error) {
      console.error('Error in estimateDeliveryTime:', error);
      this.errorMessage = 'Erreur lors de l\'estimation du temps de livraison. Vérifiez l\'adresse ou la clé API.';
      this.estimatedTime = '';
    }
  }

  async geocodeAddress(address: string): Promise<number[]> {
    try {
      console.log('Calling Mapbox Geocoding API with address:', address);
      const response$ = this.http.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${this.mapboxAccessToken}`
      );
      const data: any = await firstValueFrom(response$);
      console.log('Geocode API Response:', data);
  
      if (!data.features || data.features.length === 0) {
        throw new Error('Aucune coordonnée trouvée pour cette adresse.');
      }
  
      const coordinates = data.features[0].geometry.coordinates; // [longitude, latitude]
      return coordinates;
    } catch (error) {
      console.error('Error in geocodeAddress:', error);
      throw error;
    }
  }
  
  async getTravelTime(origin: number[], destination: number[]): Promise<number> {
    try {
      const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
      console.log('Calling Mapbox Matrix API with coordinates:', coordinates);
      const response$ = this.http.get(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?access_token=${this.mapboxAccessToken}`
      );
      const data: any = await firstValueFrom(response$);
      console.log('Matrix API Response:', data);
  
      if (!data.durations || data.durations.length === 0) {
        throw new Error('Aucun temps de trajet trouvé.');
      }
  
      const duration = data.durations[0][1]; // Durée en secondes (de origin à destination)
      return duration;
    } catch (error) {
      console.error('Error in getTravelTime:', error);
      throw error;
    }
  }
  logAddressChange(newValue: string) {
    console.log('Address changed to:', newValue);
    this.address = newValue; // Assure que this.address est bien mis à jour
  }
}
