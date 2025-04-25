import { Injectable } from '@angular/core';
import { DonationRequest } from 'src/app/front_end/pages/models/donation-request';

@Injectable({
    providedIn: 'root'
})
export class DonationRequestService {
    private storageKey = 'donation_requests';
    private donorInfoKey = 'current_donor_info';

    constructor() {}

    saveDonorInfo(email: string, name: string): void {
        console.log('Appel de saveDonorInfo avec:', { email, name });
        console.trace('Stack trace pour saveDonorInfo:');
        localStorage.setItem(this.donorInfoKey, JSON.stringify({ email, name }));
    }

    getDonorInfo(): { email: string, name: string, username?: string } | null {
        const data = localStorage.getItem(this.donorInfoKey);
        console.log('Raw data from localStorage:', data);
        
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                console.log('Parsed donor info:', parsedData);

                const name = parsedData.name || parsedData.username || '';
                const email = parsedData.email || '';
                const username = parsedData.username || undefined;

                if (name && email) {
                    return { email, name, username };
                } else {
                    console.warn('Donor info is missing required fields:', parsedData);
                    return null;
                }
            } catch (e) {
                console.error('Error parsing donor info from localStorage:', e);
                return null;
            }
        } else {
            console.warn('No donor info found in localStorage under key:', this.donorInfoKey);
            return null;
        }
    }

    addRequest(request: DonationRequest): void {
        const requests = this.getAllRequests();
        const donorInfo = this.getDonorInfo();
        const completeRequest = {
            ...request,
            userEmail: request.userEmail || donorInfo?.email || '',
            id: this.generateId(),
            date: new Date()
        };
        requests.push(completeRequest);
        localStorage.setItem(this.storageKey, JSON.stringify(requests));
    }

    getAllRequests(): DonationRequest[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    getRequestById(id: string): DonationRequest | null {
        const requests = this.getAllRequests();
        return requests.find(req => req.id === id) || null;
    }

    updateRequestStatus(id: string, status: 'pending' | 'accepted' | 'rejected'): void {
        const requests = this.getAllRequests();
        const index = requests.findIndex(req => req.id === id);
        if (index !== -1) {
            requests[index] = {
                ...requests[index],
                status: status
            };
            localStorage.setItem(this.storageKey, JSON.stringify(requests));
        }
    }

    deleteRequestById(id: string): void {
        const requests = this.getAllRequests().filter(req => req.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(requests));
    }
}