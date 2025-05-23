import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Donation, TypeDon, MaterialCategory } from 'src/app/front_end/pages/models/donation';
import { DonationRequestService } from 'src/app/back_end/services/donation-request.service';

@Injectable({
    providedIn: 'root'
})
export class DonService {
    private baseUrl = 'http://localhost:8089/dons';

    constructor(
        private http: HttpClient,
        private donationRequestService: DonationRequestService
    ) {}

    uploadPhoto(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/upload-photo`, formData, { responseType: 'text' }).pipe(
            catchError(this.handleError)
        );
    }

    addDon(don: Donation): Observable<Donation> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<Donation>(`${this.baseUrl}/add`, don, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    uploadDonMaterial(don: Partial<Donation>, file: File, category: MaterialCategory): Observable<Donation> {
        const formData = new FormData();

        // Récupérer email et username directement depuis localStorage
        const donorEmail = localStorage.getItem('email') || 'No email provided';
        const donorName = localStorage.getItem('username') || 'Anonymous';

        // Mettre à jour current_donor_info avec ces valeurs
        this.donationRequestService.saveDonorInfo(donorEmail, donorName);

        const donationData: Donation = {
            idDon: 0,
            donorContact: donorEmail,
            donorName: donorName,
            typeDon: TypeDon.MATERIEL,
            dateDon: new Date().toISOString(),
            photoUrl: '',
            category,
            amount: 0,
            heure: new Date().toLocaleTimeString(),
            uploadedImagePreview: undefined,
            description: undefined,
            phone: undefined,
            email: undefined,
            medicationName: undefined,
            lotNumber: undefined,
            expirationDate: undefined,
            productCode: undefined,
            quantity: 1
        };
        console.log('Données envoyées au backend:', donationData);
        formData.append('don', new Blob([JSON.stringify(donationData)], { type: 'application/json' }));
        formData.append('medicationImage', file);
        return this.http.post<Donation>(`${this.baseUrl}/add-with-medication`, formData).pipe(
            catchError(this.handleError)
        );
    }

    getAllDons(): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.baseUrl}/all`).pipe(
            catchError(this.handleError)
        );
    }

    getMaterialDons(): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.baseUrl}/all/material`).pipe(
            catchError(this.handleError)
        );
    }

    getMaterialDonsWithQuantity(): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.baseUrl}/all/material`).pipe(
            map((data: Donation[]) => {
                const groupedDonations = new Map<string, Donation>();

                data.forEach(donation => {
                    if (donation.photoUrl && donation.category) {
                        const key = `${donation.photoUrl}_${donation.category}`;
                        if (groupedDonations.has(key)) {
                            const existingDonation = groupedDonations.get(key)!;
                            existingDonation.quantity = (existingDonation.quantity || 0) + (donation.quantity || 1);
                            const existingDate = new Date(existingDonation.dateDon);
                            const newDate = new Date(donation.dateDon);
                            if (newDate > existingDate) {
                                existingDonation.dateDon = donation.dateDon;
                            }
                        } else {
                            groupedDonations.set(key, { ...donation });
                        }
                    }
                });

                return Array.from(groupedDonations.values());
            }),
            catchError(this.handleError)
        );
    }

    getDonsByCategory(category: string): Observable<Donation[]> {
        return this.http.get<Donation[]>(`${this.baseUrl}/material/category/${category}`).pipe(
            map((data: Donation[]) => {
                const groupedDonations = new Map<string, Donation>();

                data.forEach(donation => {
                    if (donation.photoUrl && donation.category) {
                        const key = `${donation.photoUrl}_${donation.category}`;
                        if (groupedDonations.has(key)) {
                            const existingDonation = groupedDonations.get(key)!;
                            existingDonation.quantity = (existingDonation.quantity || 0) + (donation.quantity || 1);
                            const existingDate = new Date(existingDonation.dateDon);
                            const newDate = new Date(donation.dateDon);
                            if (newDate > existingDate) {
                                existingDonation.dateDon = donation.dateDon;
                            }
                        } else {
                            groupedDonations.set(key, { ...donation });
                        }
                    }
                });

                return Array.from(groupedDonations.values());
            }),
            catchError(this.handleError)
        );
    }

    getDonById(id: number): Observable<Donation> {
        return this.http.get<Donation>(`${this.baseUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    updateDon(id: number, don: Donation): Observable<Donation> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<Donation>(`${this.baseUrl}/update/${id}`, don, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    deleteDon(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Erreur de communication avec le serveur. Vérifiez la console pour plus de détails.'));
    }
}